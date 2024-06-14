DEST = paulshannnon@pshannon.net:public_html/pshannon.net/fernStory/
default:
	@echo build
	@echo view
	@echo viewRemote
	@echo publish
	@echo publish.images
	@echo publish.new

build:
	m4 -P main.pre > page.html

view:
	open page.html

publish:
	scp page.html $(DEST)/index.html
	scp fosp.js $(DEST)
	scp fosp.css $(DEST)

publish.images:
	scp seattlesCrownJewel.png $(DEST)
	scp hatcheryValleyFromTheSouth-2011-jordanJackson.jpg $(DEST)
	scp hatcheryValleyFromTheSouth-2017.jpg $(DEST)
	scp regionalSwordFernDieOffMap3.png $(DEST)
	scp windfall-2019-looking-east-100-women-who-care.png $(DEST)
	scp windfall-2022-looking-east.png $(DEST)

viewRemote:
	open https://pshannon.net/fernStory


publish.new:
	scp new.html $(DEST)
	scp newFosp.js $(DEST)
	open https://pshannon.net/fernStory/new.html



