package handlers

import (
	"vingo/database"

	"log"

	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}
	id := sess.Get(USER_ID)
	username := sess.Get(USERNAME)
	return c.Render("index", fiber.Map{"user_id": id, "username": username})
}

func Scans(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}
	zauth_id := sess.Get(USER_ID)

	scans_select, _ := db.Prepare("SELECT scans.scan_time, scans.card FROM cards LEFT JOIN scans WHERE user == ?;")
	log.Println(zauth_id)
	scan_rows, err := scans_select.Query(zauth_id)
	if err != nil {
		log.Println(err)
		return c.Status(400).SendString("Error fetching scans")
	}

	var scans []database.Scan

	for scan_rows.Next() {
		var scan database.Scan
		_ = scan_rows.Scan(&scan.ScanTime, &scan.Serial)

		scans = append(scans, scan)
	}

	return c.Render("scans", fiber.Map{"scans": scans})
}
