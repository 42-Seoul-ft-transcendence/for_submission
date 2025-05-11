IMAGE = frontend backend
VOLUME = backend_vol
HOST_VOL = backend/vol

all: main

main:
	mkdir -p $(HOST_VOL)
	docker-compose build
	docker-compose up -d

start:
	docker-compose start

stop:
	docker-compose stop

clean:
	docker-compose down

fclean: clean
	docker rmi -f $(IMAGE)
	docker volume rm -f $(VOLUME)
	rm -rf $(HOST_VOL)

re: fclean all
