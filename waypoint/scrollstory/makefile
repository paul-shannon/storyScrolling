default:
	@echo link 
	@echo digest
	@echo server
	@echo view-local
	@echo all

link:
	ln -sfn ../florilegium/img media

digest:
	python build.py story.yaml

PORT = 4441

server:
	 python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

view-local:
	open http://localhost:$(PORT)/

all: link digest view-local
