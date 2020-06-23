# Linewize ChromeWindow

Linewize ChromeWindow works with Schools that use the Linewize network appliance to provide teachers with realtime screen
visibility into there students chrome usage.

Exposed through Linewize Classwize which provides a teacher with a classroom view, this provides additional insight into
what students are doing online and helps educate digital citizenship.

```python

Traceback (most recent call last):

  File "/usr/local/lib/python2.7/dist-packages/tornado/web.py", line 1592, in _execute
    result = yield result

  File "/usr/local/lib/python2.7/dist-packages/tornado/gen.py", line 1133, in run
    value = future.result()

  File "/usr/local/lib/python2.7/dist-packages/tornado/concurrent.py", line 261, in result
    raise_exc_info(self._exc_info)

  File "/usr/local/lib/python2.7/dist-packages/tornado/gen.py", line 1141, in run
    yielded = self.gen.throw(*exc_info)

  File "/app/configurationgateway2/handler/chrome_windows_handlers.py", line 51, in get
    messages = yield get__messages_for_device_user(device_id, email_address)

  File "/usr/local/lib/python2.7/dist-packages/tornado/gen.py", line 1133, in run
    value = future.result()

  File "/usr/local/lib/python2.7/dist-packages/tornado/concurrent.py", line 261, in result
    raise_exc_info(self._exc_info)

  File "/usr/local/lib/python2.7/dist-packages/tornado/gen.py", line 1141, in run
    yielded = self.gen.throw(*exc_info)

  File "/app/configurationgateway2/service.py", line 8, in get__messages_for_device_user
    req_resp = yield fetch_coroutine("%s/message/%s/user/%s" % (config["CLASSWIZE_EVENT_SERVICE"], deviceid, user))

  File "/usr/local/lib/python2.7/dist-packages/tornado/gen.py", line 1133, in run
    value = future.result()

  File "/usr/local/lib/python2.7/dist-packages/tornado/concurrent.py", line 261, in result
    raise_exc_info(self._exc_info)

  File "/usr/local/lib/python2.7/dist-packages/tornado/gen.py", line 1141, in run
    yielded = self.gen.throw(*exc_info)

  File "/app/configurationgateway2/client.py", line 23, in fetch_coroutine
    response = yield http_client.fetch(safe_url, raise_error=True, connect_timeout=20.0, request_timeout=120.0, **kwargs)

  File "/usr/local/lib/python2.7/dist-packages/tornado/gen.py", line 1133, in run
    value = future.result()

  File "/usr/local/lib/python2.7/dist-packages/tornado/concurrent.py", line 261, in result
    raise_exc_info(self._exc_info)

  File "<string>", line 3, in raise_exc_info
```
