default:
	@echo link 
	@echo build
	@echo server
	@echo view-local
	@echo view-remote


build:
	python build.py story.yaml backstory.yaml

PORT = 4441

server:
	 python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

view-local:
	open http://localhost:$(PORT)/

view-remote:
	open https://pshannon.net/story

publish:
	scp index.html backstory.html paulshannnon@pshannon.net:public_html/pshannon.net/story/
	rsync -a story.css  paulshannnon@pshannon.net:public_html/pshannon.net/story/
	rsync -a *.js  paulshannnon@pshannon.net:public_html/pshannon.net/story/
	rsync -a media/  paulshannnon@pshannon.net:public_html/pshannon.net/story/media
	rsync -a text/ paulshannnon@pshannon.net:public_html/pshannon.net/story/text
