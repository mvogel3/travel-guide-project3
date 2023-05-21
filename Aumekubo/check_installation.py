import sys
import flask

print("Python Installation Location:")
print(sys.executable)

print("Flask Installation Location:")
print(flask.__file__)

import sqlalchemy
print(dir(sqlalchemy))

