import vercel
import json

_print_result_ = []
_error_result_ = [] 
print = _print_result_.append
def input(*args, **kwargs):
    return _error_result_.append('EOFError: EOF when reading a line')

class handler(vercel.API):
    def vercel(self, url, data, headers):
        #print('url === '+ url)
        try:
            exec(data['code'])
        except Exception as e:
            _error_result_.append(str(e))
        
        self.send_code(200)
        self.send_header('Access-Control-Allow-Origin','https://yiyan.baidu.com')
        self.send_header('Content-Type','application/json')
        self.send_text(json.dumps({
            'result': '\n'.join(list(map(str, _print_result_))),
            'error': '\n'.join(list(map(str, _error_result_)))
        }))