cd ~/bin
mkdir restatic
cd restatic
wget https://github.com/JPalounek/restatic/tarball/v0.2
tar -xf v0.2
mv JPalounek-restatic*/* .

rm -rf v0.1
rm -rf JPalounek-restatic*/

cd /usr/sbin
link ~/bin/restatic/restatic restatic