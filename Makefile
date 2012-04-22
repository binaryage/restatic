SRC = lib/events.js lib/superagent.js

TESTS = test/*.js
REPORTER = list

all: superagent.js superagent.min.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--growl \
		$(TESTS)

test-cov: lib-cov
	SUPERAGENT_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	jscoverage lib lib-cov

superagent.js: $(SRC)
	cat $^ > $@

superagent.min.js: superagent.js
	uglifyjs --no-mangle $< > $@

docs: test-docs

test-docs:
	make test REPORTER=doc \
		| cat docs/test_results/head.html - docs/test_results/tail.html \
		> docs/test_results/test.html

clean:
	rm -f superagent{,.min}.js

.PHONY: test-cov test docs test-docs clean