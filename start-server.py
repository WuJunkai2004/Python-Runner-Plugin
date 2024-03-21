from imp  import load_source
from io   import StringIO
from http import server

import os
import sys
import vercel

def Start(handler = vercel.API, port = 8081):
    server.test(
        HandlerClass = handler,
        ServerClass = server.ThreadingHTTPServer,
        port = port,
        bind = None
    )

class handler(vercel.API):
    def vercel(self, url, data, headers):
        #print('url === '+ url)
        if(os.path.isdir(url)):
            self.send_code(200)
            self.send_header('Content-Type','plain/text')
#            self.send_header('Access-Control-Allow-Origin','https://yiyan.baidu.com')
            self.send_text( '\n'.join(os.listdir(url)) )
            return

        if(os.path.isfile(url)):
            if(os.path.splitext(url)[1]=='.py'):
                vercel.ErrorStatu(self, 403)
                return
            self.send_code(200)
            if(vercel.file_type(url.split('.')[-1])[:5] == 'image'):
                self.send_header('Access-Control-Allow-Origin','*')
                self.send_header('Content-Type',vercel.file_type(url.split('.')[-1]))
                self.send_header('Content-Length',str(os.path.getsize(url)))
                self.send_header('Connection','keep-alive')
                self.send_file(url)
                return
            self.send_header('Access-Control-Allow-Origin','https://yiyan.baidu.com')
            self.send_header('Content-Type',vercel.file_type(url.split('.')[-1]))
            self.send_header('Content-Length',str(os.path.getsize(url)))
            self.send_file(url)
            return

        if(os.path.isfile(url + '.py')):
            mod = load_source(url,url + '.py')
            mod.handler.vercel(self, url, data, headers)
            return

        vercel.ErrorStatu(self, 404)

if(__name__=='__main__'):
    Start( handler )