#!/bin/sh
# Make sure permissions are correct
sudo -E -u www-data /bin/wp-cli.phar $*
