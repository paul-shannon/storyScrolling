default:
	@echo venv
	@echo digest
	@echo build
	@echo publish
	@echo view-local
	@echo view-remote
	@echo all [digest, build, view]

venv:
	@echo source /Users/paul/github/slexil2/py3105slexil/bin/activate

digest:
	python ../readWaypoints.py story.yaml

build:
	m4 -P ../html.pre > app.html
	m4 -P ../js.pre   > app.js

all: digest build view

PORT = 4440

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

view-local:
	open http://localhost:$(PORT)/app.html

publish:
	scp app.html paulshannnon@pshannon.net:public_html/pshannon.net/story/index.html
	scp app.js paulshannnon@pshannon.net:public_html/pshannon.net/story/

view-remote:
	open https://pshannon.net/story
