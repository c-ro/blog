---
layout: post
title:  "Hide API Keys from GitHub Repository in Node Projects"
date:   2016-02-12 15:51:57 -0500
categories: node github 
---

Obviously you shouldn't put your API keys, secrets, tokens, etc in a public repo, so don't do it.  Deleting these from your project immediately before pushing to github would be a real drag and a huge waste of time and energy. Stop messing around and store your keys in a seperate file, export the keys, require them in your main script and then tell git to ignore the keys file during push.  Here's an example using the [Twit API](https://github.com/ttezel/twit)

Create a file called keys.js (or whatever) and use node's module.exports to makes your keys available outside of keys.js:

{% highlight javascript %}
module.exports = {
	twit: {
		consumer_key: '36fnsksd0dsoidnsdf098vc03iw0ifdw',
	    consumer_secret: '89hsfhufepiuqu9hafsy97afwhuprqbwiafigsphiuaf',
	    access_token: '3fhu93fnioefgiofgej0if39hufg79hgr3',
	    access_token_secret: 'h98age9h8aegh98ge0eg0ji090u8u08ermk'
	}
};
{% endhighlight %}

Then, in your main script, require your keys file which has been made available via module.exports:

{% highlight javascript %}
var keys = require('./keys');

var twitter = new Twit(keys.twit);
{% endhighlight %}

Great, everything should be working now that you have your keys stored in one file, exported via node, and required in your script.  All that's left to do is tell git to ignore keys.js.  Easy.  Created a file called ".gitignore".  One way is to navigate to your repo and type:
	
{% highlight console %}
touch .gitignore.
{% endhighlight %}

In this file, type "keys.js" (or whatever) save, close, add, commit, and push.  Viola - out of sight, off of github.



