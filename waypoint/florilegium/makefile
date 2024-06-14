default:
	@echo fromYaml
	@echo assemble
	@echo view

fromYaml:
	python ../readWaypoints.py story.yaml

assemble:
	m4 -P ../html.pre > app.html
	m4 -P ../js.pre   > app.js

view:
	open app.html
