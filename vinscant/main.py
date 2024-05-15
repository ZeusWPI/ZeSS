import mfrc522 
import urequests as req


def get_key():
    with open("key.txt", "r") as file:
        return file.read().strip()

def uidToString(uid):
    mystring = ""
    for i in uid:
        mystring = "%02X" % i + mystring    
    return mystring
    
def do_read():
    rdr = mfrc522.MFRC522(sck=36,mosi=35,miso=37,rst=0,cs=34)

    print("")
    print("Place card before reader to read from address 0x08")
    print("")

    try:
        while True:
            (stat, tag_type) = rdr.request(rdr.REQIDL)
            if stat == rdr.OK:
                (stat, uid) = rdr.SelectTagSN()
                if stat == rdr.OK:
                    # beep
                    uid = uidToString(uid)
                    print("Card detected %s" % uid)
                    res = req.post("https://zess.zeus.gent/scans", data=f"{uid};{key}")
                    print(res.text)
                    res.close()
                    # beep beep
                else:
                    print("Authentication error")
    except KeyboardInterrupt:
        print("KeyboardInterrupt")
        return

key = get_key()
do_read()