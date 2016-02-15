---
title: Quickly Get List of SoundCloud Artists You Follow
layout: post
date: 2016-02-14 10:52:39 -0500
categories: DevTools Miscellaneous SoundCloud
---
Soundcloud.com is a great service.  Seriously, can't get enough of it.  Unforunately, I also couldn't get a plain text list of the artists I was following, which I needed for reasons.  Thankfully, since Soundcloud does provide a really slick web page listing the artists I follow at [https://soundcloud.com/you/following](https://soundcloud.com/you/following) I was able to get the data I wanted with just a little bit of Javascript.

If you want to see *your* list simply copy the code below and paste it into your browser's console.  Make sure you have [https://soundcloud.com/you/following](https://soundcloud.com/you/following) opened and scroll all the way to the bottom of your list.  Otherwise, stick around for a quick breakdown.

{% highlight javascript %}
var badges = document.getElementsByClassName('genericBadge__usernameHeading');
var usernames = [];

for (var i = 0; i < badges.length; i++){
	var link = badges[i].href.split('/');
	usernames.push(link[3]);
}

var usernames = usernames.reduce(function(prev, curr){
					return prev + '<br>' + curr;
				});

window.document.write(usernames);
{% endhighlight %}

A Quick Breakdown:

We start by identifying which data we want to extract from the page.  When we open [https://soundcloud.com/you/following](https://soundcloud.com/you/following) we see a grid of thumbnails, each representing a different artist.  That's a good starting point -- with a little help from [CSSViewer](https://chrome.google.com/webstore/detail/cssviewer/ggfgijbpiheegefliciemofobhmofgce?hl=en) we can quickly identify that objects we need will have the class 'genericBadge__usernameHeading'.

{% highlight javascript %}
var badges = document.getElementsByClassName('genericBadge__usernameHeading');
{% endhighlight%}

Once we have the className of the objects we want to work with we can easily load them into an array-like object called an [HTML Collection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection) by selecting them with document.getElementsByClassName.  Since an HTML Collection is *not* an array but rather an *array-like object* we will not have the ability to use Array methods (such as Array.protoype.forEach).  However, we can use a simple for-loop to iterate over the collection.

In this case, our HTML Collection contains links to each artist's profile.  We will be reading each link's href property and extracting our artist's names from the url.

{% highlight javascript %}
var usernames = []; // let's store the results of each iteration for later use

for (var i = 0; i < badges.length; i++){
	var link = badges[i].href.split('/'); // the profile URL convention is http://soundcloud.com/artist
	usernames.push(link[3]);		      // so we can always find usernames after the third '/'
}
{% endhighlight %}

Now that we have an array of usernames all we have to do is display them.  For my purposes the format needed to be one name per line without commas.  Let's write the contents of the usernames array as an html document in the current window:

{% highlight javascript %}
var usernames = usernames.reduce(function(prev, curr){ return prev + '<br>' + curr });
window.document.write(usernames);
{% endhighlight %}

And that's pretty much it.  In another context I would do some refactoring but the way SoundCloud protects against injected scripts makes the verbosity necessary.