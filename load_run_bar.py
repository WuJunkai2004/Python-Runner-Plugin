import vercel
import json

class handler(vercel.API):
    def vercel(self, url, data, headers):
        self.send_code(200)
        self.send_header('Access-Control-Allow-Origin','https://yiyan.baidu.com')
        self.send_header('Content-Type','application/json')
        self.send_text(json.dumps({
            'img': "localhost:8081/image/run_bar.png",
        }))