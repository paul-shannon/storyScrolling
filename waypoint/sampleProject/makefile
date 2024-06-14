REMOTE_HOST = paulshannnon@pshannon.net:public_html/pshannon.net/florilegium/
default:
	@echo fromYaml
	@echo assemble
	@echo assemble


fromYaml:
	python ../readWaypoints.py data.yaml

assemble:
	m4 -P ../html.pre > app.html
	m4 -P ../js.pre   > app.js

view:
	open app.html

