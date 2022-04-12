import sys, getopt

def main(argv):
   if len(argv)>1:
      #0,1,2 = '<','=','>'
      print(1, end = '')
   sys.stdout.flush()

if __name__ == "__main__":
   main(sys.argv)