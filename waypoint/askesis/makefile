REMOTE_HOST = paulshannnon@pshannon.net:public_html/pshannon.net/florilegium/
default:
	@echo fromYaml
	@echo assemble
	@echo view
	@echo all [fromYaml, assemble, view]


fromYaml:
	python readWaypoints.py askesis.yaml

assemble:
	m4 -P html.pre2 > app.html
	m4 -P js.pre   > app.js

view:
	open app.html

all: fromYaml assemble view

