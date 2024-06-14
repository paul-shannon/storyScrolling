default:
	@echo fromYaml
	@echo assemble

fromYaml:
	python ../readWaypoints.py data.yaml

assemble:
	m4 -P ../html.pre > app.html
	m4 -P ../js.pre   > app.js
