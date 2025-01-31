import sys
import re
nM = input()
numMsg = 0
Msgs=[]
pattern = r'^[a-zA-Z]+$'
pattern2 = r'^\d+$'
matched = False
if re.match(pattern2,nM):
  matched = True
  numMsg = int(nM)
if numMsg < 1 or numMsg>100 or matched==False:
  sys.exit(0)
while len(Msgs)< numMsg:
  msg = input()
  if((len(msg)>=1 and len(msg)<=10000) and re.findall(pattern, msg)):
    Msgs.append(msg)
  else:
    sys.exit(0)

def cypher(numMsg,Msgs):
  K=0
  for j in range(numMsg):
    i = 0
    while i*i < len(Msgs[j]):
      i+=1
    cypherArr = [['' for _ in range(i)] for _ in range(i)]
    rotCypherArr = [['' for _ in range(i)] for _ in range(i)]
    index =0
    for row in range(i):
      for col in range(i):
          if index < len(Msgs[j]):
              ms = Msgs[j]
              cypherArr[row][col] = ms[index]
              index+=1
          else:
            cypherArr[row][col] = "*"
    for row in range(i):
      for col in range(i):
        rotCypherArr[row][col]=cypherArr[i-col-1][row]
    final = ''
    for row in range(i):
      for col in range(i):
          if rotCypherArr[row][col] !="*":
            final += rotCypherArr[row][col]
    print(final)
cypher(numMsg,Msgs)