#!/bin/bash

if [ $# -lt 1 ] ; then
        echo "Usage: parse google docs spreadsheet content using 'restatic source_folder target_folder'"
        echo 
        echo "By Binaryage.com, for more info see projects homepage - restatic.binaryage.com or github wiki"
        echo " git@github.com:JPalounek/goopages.git"
        exit 1
fi

echo "Restatic started parsing html files from $1 to $2."

if [ -d $1 ]
then
	if [ -d $1 ]
	then
		php parser.php $1 $2
	else
		echo "Target dir doesnt exists."
	fi
else
 echo "Source dir doesnt exists."
fi