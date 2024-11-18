##################################################
# --- HELPER SCRIPT TO ADD PACKAGES          --- #
# Relinks the base directory afterwards          #
##################################################

# --- install packages --- # 
echo "--- INSTALLING PACKAGES ---"
npm install $@ 
echo

# --- link directories --- # 
echo "--- LINKING DIRECTORIES ---" 
echo -e "\tLinking base folder."
if [ -L ./node_modules/\$ ]; then
    unlink ./node_modules/\$ 
fi
ln -s ../ ./node_modules/\$ 

echo -e "\tLinking source folder."
if [ -L ./node_modules/\@src ]; then
    unlink ./node_modules/\@src
fi
ln -s ../src ./node_modules/\@src

echo "Done."