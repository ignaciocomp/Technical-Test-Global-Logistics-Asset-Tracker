CC = gcc
CFLAGS = -ansi -Wall -Wextra -pedantic -fPIC

all: libhealth_score.so

libhealth_score.so: health_score.c health_score.h
	$(CC) $(CFLAGS) -shared -o $@ health_score.c

test: test_main
	./test_main

test_main: test_main.c health_score.c health_score.h
	$(CC) $(CFLAGS) -o $@ test_main.c health_score.c -lm

clean:
	rm -f libhealth_score.so test_main

.PHONY: all test clean
