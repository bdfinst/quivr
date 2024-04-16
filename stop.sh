supabase stop

for OL in `ps -ef | grep 'ollama run' | grep -v grep | awk '{print $2}'`
do
	kill ${OL}
done

docker stop $(docker ps -a -q)
