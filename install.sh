# Create a directory
mkdir ~/.restatic
cd ~/.restatic

# Download latest stabile version
wget https://github.com/binaryage/restatic/tarball/v0.3
tar -xf v0.3
mv binaryage-restatic*/* .
npm install

# Sweep after operations
rm -rf v0.3
rm -rf binaryage-restatic*/

# Link bash to callable command
cd /usr/sbin
link ~/.restatic/restatic restatic