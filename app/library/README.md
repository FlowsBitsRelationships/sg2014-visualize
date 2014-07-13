sg2014-visualize
================
A running list of interesting queries...

MATCH (n:Place) RETURN DISTINCT n

MATCH (n:Place) WHERE n.name = "7-Eleven" OR  n.name = "7-11" OR n.name = "7/11" OR "7 Eleven" OR "7 eleven"  return n

MATCH (n:Place) WHERE n.name = "Kowloon" return n

MATCH (n:Social)-[r]->(m:Place{name:'Kowloon'}) return r as rels

match (n:Users) -[r]-> () WHERE type(r) = 'TWEETED' RETURN r as rels  LIMIT 50

MATCH (a)-[:TWEETED]->(b) WHERE a.followers_count > 1000 RETURN DISTINCT a

start a = node(*)
WHERE a.name = "Kowloon"
MATCH path = a <– [ : MENTIONED* ] - c – [ : MENTIONED* ] -> z 
return path

NODES: Users, Place, Social, ReferenceNode
RELATIONSHIPS: Tweeted, Mentioned