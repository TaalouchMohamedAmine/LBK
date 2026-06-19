import urllib.request
import re

url = "https://picuki.com/profile/centre_lina_boukadida_lbk"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'src="(https://[^"]+\.jpg[^"]*)"', html)
    print("IMAGE_URLS:")
    for img in images[:10]:
        print(img)
except Exception as e:
    print("Error:", e)
