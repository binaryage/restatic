# Create a directory
mkdir ~/.restatic
cd ~/.restatic

# Download latest stabile version
wget https://github.com/JPalounek/restatic/tarball/v0.2
tar -xf v0.2
mv JPalounek-restatic*/* .

# Sweep after operations
rm -rf v0.2
rm -rf JPalounek-restatic*/

# Link bash to callable command
cd /usr/sbin
link ~/.restatic/restatic restatic
