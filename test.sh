#!/bin/bash

SERVER_ADDRESS="http://localhost:8788"

echo -e "\e[1;32m"
echo "---------------------------------------------------------------------"
echo "Test $SERVER_ADDRESS/api/auth"
echo "---------------------------------------------------------------------"
echo -e "\e[0m"

curl -X "POST" "$SERVER_ADDRESS/$DEVICE_KEY" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
        "username": "test",
        "password": "test"
    }'