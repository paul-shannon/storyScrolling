REMOTE_HOST = paulshannnon@pshannon.net:public_html/pshannon.net/florilegium/

default:
	@echo venv
	@echo fromYaml
	@echo assemble
	@echo view
	@echo all [fromYaml, assemble, view]


venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

fromYaml:
	python readWaypoints.py story.yaml

assemble:
	m4 -P html.pre2 > app.html
	m4 -P js.pre   > app.js

view:
	open app.html

all: fromYaml assemble view

