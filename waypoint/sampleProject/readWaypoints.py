import os, sys
import argparse
import pdb
import yaml
import pathlib
nextDiv = 0
if(len(sys.argv) == 1):
    print("usage: python readWaypoints.py <file.yaml>")
    sys.exit(1)

file = sys.argv[1]

if(not os.path.isfile(file)):
    print("cannot read %s" % file)
    sys.exit(2)
    
fullPath = os.path.abspath(file)
directory = os.path.dirname(fullPath)
#--------------------------------------------------------------------------------
def writeHTML(x, divID):
    s = "<div id='section%d' class='sectionDiv'>\n" % divID

    if('mainText' in x.keys()):
       filename = x['mainText']    
       filepath = "%s/%s" % (directory, filename)
       with(open(filepath, "r") as f):
          s += f.read()

    if('img' in x.keys()):
       img = x['img']
       if(img != None):
          if(len(x['img'].strip()) > 0):
             s += x['img']
             # s += "<img src='%s'>" % x['img']

    if('mp4' in x.keys()):
      video = x['mp4'].strip()
      print("found mp4: %s" % video)
      if (len(video) > 0):
         videoLink = """<video width='800' controls> <source src='%s' type="video/mp4"> </video>""" % video
         print("videoLink: %s" % videoLink)
         s += videoLink
         
    if('youtube' in x.keys()):
       video = x['youtube']
       if(video != None):
          if (len(x['video'].strip()) > 0):
             s += """<iframe width="1200" height="800"
  src="%s"
  title="YouTube video player" frameborder="0" allow="accelerometer;
  autoplay; clipboard-write; encrypted-media; gyroscope;
  picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen></iframe>""" % x['video']

    if('link' in x.keys()):
       link = x['link']
       if(link != None):
          if(len(x['link'].strip()) > 0):
             s += '<iframe src="%s">' % x['link']
             s += '</iframe>\n'

    s += "\n</div>\n"
    return s

#--------------------------------------------------------------------------------
def writeJavascript(x, divID):

   divIdString = "#section%d" % divID

   text = x['associatedText']
   
   s = """$('%s').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#commentsDiv').text("%s")
             }
          },
      offset: 300
     })\n""" % (divIdString, x['associatedText'])

   s += """$('%s').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("%s")
             }
          },
      offset: '-50%%'
     })\n""" % (divIdString, x['associatedText'])

   return(s)

#--------------------------------------------------------------------------------
yamlFile = fullPath

with open(yamlFile, 'r') as f:
   sections = yaml.safe_load(f)['sections']

nextDiv = 0
outfile = "%s/%s" % (directory, "html.txt")
with open(outfile, 'w') as f:
   for section in sections:
      nextDiv += 1
      print(section['associatedText'])
      s = writeHTML(section, nextDiv)
      f.write(s)
      
      
    

nextDiv = 0
outfile = "%s/%s" % (directory, "js.txt")
with open(outfile, 'w') as f:
   for section in sections:
      nextDiv += 1
      s = writeJavascript(section, nextDiv)
      f.write(s)
   
 
