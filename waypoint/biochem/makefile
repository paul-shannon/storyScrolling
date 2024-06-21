default:
	@echo venv
	@echo digest
	@echo build
	@echo view
	@echo all [digest, build, view]

venv:
	@echo source /Users/paul/github/slexil2/py3105slexil/bin/activate

digest:
	python ../readWaypoints.py story.yaml

build:
	m4 -P ../html.pre > app.html
	m4 -P ../js.pre   > app.js

view:
	open app.html

all: digest build view

