<a name="v0.1.2"></a>
### v0.1.2 (2013-10-25)


#### Bug Fixes

* **travis:** install karma@v0.10.2 due to broken v0.10.3 ([dc995dc7](http://github.com/caitp/ui-comments/commit/dc995dc70fe0b09c1a8bb106e9bd2f092a998ca3))

<a name="v0.1.1"></a>
### v0.1.1 (2013-10-23)


#### Bug Fixes

* **events:** now emiting $scope events rather than DOM events ([7b711238](http://github.com/caitp/ui-comments/commit/7b7112382498d451de0d852a4625376e9942f2e8))


#### Breaking Changes

* 
Rather than binding `$element.bind('filled.comments', fn)`, one must instead
`$scope.$on('$filledNestedComments', fn)` and expect a jQuery/jqLite element,
which is either the comment element itself (if there is no commentsTransclude
in use), or the commentsTransclude element (or the comments collection which
replaces it) if it is present.

Similarly, `$element.bind('emptied.comments', fn)` must instead be written as
`$scope.$on('$emptiedNestedComments', fn)`. The same parameter rules as above
apply.

The event names are not yet final, and will likely be broken again in the near
future.
 ([7b711238](http://github.com/caitp/ui-comments/commit/7b7112382498d451de0d852a4625376e9942f2e8))

<a name="v0.1.0"></a>
## v0.1.0 (2013-10-22)


#### Features

* **comments:** directive to define insert nested comments in template ([4c796ccc](http://github.com/caitp/ui-comments/commit/4c796ccca6ebaf7484ab7034a40138756d183cb5))

<a name="v0.0.10"></a>
### v0.0.10 (2013-10-22)


#### Bug Fixes

* **style:** remove tab spacing from source files ([2066c22f](http://github.com/caitp/ui-comments/commit/2066c22f3baf107fabdf7c5bdb244e5c80c74799))

<a name="v0.0.9"></a>
### v0.0.9 (2013-10-16)

<a name="v0.0.8"></a>
### v0.0.8 (2013-09-27)

<a name="v0.0.7"></a>
### v0.0.7 (2013-09-27)


#### Bug Fixes

* **release:**
  * gh-pages add, don't delete old content. ([2ba46417](http://github.com/caitp/ui-comments/commit/2ba464175bea2993347b3c9bb7e514d2b6117dc5))
  * gh-pages before SNAPSHOT, and ignore SNAPSHOT ([49dca37b](http://github.com/caitp/ui-comments/commit/49dca37b7fd2d82ada4efc70ac63f034b7f1e21f))


#### Features

* **docs:** Setup GA on API docs and demo ([0a125574](http://github.com/caitp/ui-comments/commit/0a12557419cee244f33722664afd1fe2dc95882a))

<a name="v0.0.6"></a>
### v0.0.6 (2013-09-26)


#### Bug Fixes

* **release:**
  * Cleanup test build before release ([1305a435](http://github.com/caitp/ui-comments/commit/1305a435f702398cc9836e9fa5c5322663ea942e))
  * Generate gh-pages for correct version. ([01805f25](http://github.com/caitp/ui-comments/commit/01805f2516b5c0d62716b582f2cf02f6e9b8b395))
  * gh-pages before SNAPSHOT, and ignore SNAPSHOT ([54ae7b2d](http://github.com/caitp/ui-comments/commit/54ae7b2dae85be06c014b2a0040c06e1edaac820))

<a name="v0.0.5"></a>
### v0.0.5 (2013-09-26)


#### Bug Fixes

* **release:** Generate gh-pages branch before setting SNAPSHOT version ([52cb6549](http://github.com/caitp/ui-comments/commit/52cb65491d84a70104f25dcff7bfe0f74c2d34e2))

<a name="v0.0.4"></a>
### v0.0.4 (2013-09-26)


#### Bug Fixes

* **TravisCI:** Use `npm --silent` instead of `npm --quiet` ([bcd30e2a](http://github.com/caitp/ui-comments/commit/bcd30e2ac21a79ce3fe92b759cac09b9a8c75dc6))
* **demo:** Fixup demo URL to API docs ([ac467814](http://github.com/caitp/ui-comments/commit/ac467814e982354e3a93c17d9b2acba63b5e8dda))
* **ngdocs:** Temporarily using fork which preprocesses navTemplate ([f0812f45](http://github.com/caitp/ui-comments/commit/f0812f45a529513fcbda9fc7ca95e525cca1e785))


#### Features

* **tools:** Auto-publishing of gh-pages branch. ([c1508fcb](http://github.com/caitp/ui-comments/commit/c1508fcbf83d749e28be8915f56ac9a6af4640a0))

<a name="v0.0.3"></a>
### v0.0.3 (2013-09-26)


#### Bug Fixes

* **comments:** Improve commentsConfig.set() perf. ([7bfc109d](http://github.com/caitp/ui-comments/commit/7bfc109d489a965e18c77907438a2419d79952fa))
* **dependencies:** Update semver and shelljs devDependencies ([ba71f839](http://github.com/caitp/ui-comments/commit/ba71f83993997967d1a5a76cf56abd5d8a405506))
* **event:** Emit event only after compilation is completed ([c5c23b6d](http://github.com/caitp/ui-comments/commit/c5c23b6dd3d4c8765f26567eee547106a7f1653f))
* **release:** Prefix tag-names with 'v', for semver-ness ([29f20bc6](http://github.com/caitp/ui-comments/commit/29f20bc637ed78652793f6c2a0ef2e5eaae9f0cf))
* **template:** ngHref and ngSrc directives fixed ([a8835770](http://github.com/caitp/ui-comments/commit/a8835770b8da14b7a83a452647f3f4f21e4dd1c2))


#### Features

* **comments:** Instantiate configured controller for comments ([07390982](http://github.com/caitp/ui-comments/commit/07390982172e8ea1a5a956b8c3362aa45bca2d7f))
* **events:** Comment now emit when children truthiness changes ([13f702e5](http://github.com/caitp/ui-comments/commit/13f702e56273f40d5ea671ffa5a37ff952850150))

