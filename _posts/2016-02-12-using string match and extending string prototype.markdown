---
layout: post
title:  "Notes on String.prototype.match, Capture Groups, Global Matching, and Extending the String Object"
date:   2016-02-12 16:02:57 -0500
categories: javascript prototype String RegExp
---

Javascript's String.prototype.match is a handy little method.  Take a string, tack on a .match fed with the regex of your choice and watch as it returns a neat little array containing the matched group, the captured group, the starting index of your matched substring, and just for good measure: the original string.  Consider a tweet updating fans on the current score of a soccer match.

{% highlight javascript%}
var string = "45' - Halftime, the teams head back to the locker rooms with a score of 2-2(3-5).  Stay tuned for the second half!";
{% endhighlight%}

Let's extract the current score (2-2) but not the aggregate score ((3-5)).  Our current score will always be preceded by '\s' and the aggregate by '(' so we will use a regex that matches a substring with a non-capturing group (?:\s) and a capturing group (\d{1,2}-\d{1,2}).  

{% highlight javascript%}
var matchResult = string.match(/(?:\s)(\d{1,2}-\d{1,2})/);

console.log(matchResult);
{% endhighlight%}
{% highlight console%}
[ ' 2-2',
  '2-2',
  index: 71,
  input: '45/' - Halftime, the teams head back to the locker rooms with a score of 2-2(3-5). Stay tuned for the second half!']
{% endhighlight%}

As promised, we've now got an array containing four values.  Since we are interested in the captured group and not the entire match we can retrieve the current score like so:

{% highlight javascript%}
console.log(matchResult[1]);
{% endhighlight%}
{% highlight console%}
2-2
{% endhighlight%}

Perfect!  We've successfully returned a single substring from the tweet.  But what if we're interested in every returning every matching substring and not just the first?  Usually with String.prototype.match we would simply add the global flag to our regex expecting a array of matches.  Let's look at a new tweet and see if we can return an array containing all of the username mentions (@username) while avoiding email addresses (that's a thing, trust me).  We'll use the non-capturing group (?:^\|\s) to determine if a substring is preceded by the start of a line or whitespace and the capturing group (@\w{1,15}) to identify username mentions.  Don't forget about our global flag (g):

{% highlight javascript%}
var string = "@gnirtsmodnar @sumerfish @xfilesbutemoji, have you been getting weird messages from spooky@email.biz?"

var matchResult = string.match(/(?:^|\s)(@\w{1,15})\b/g);

console.log(matchResult);
{% endhighlight%}
{% highlight console %}
[ '@gnirtsmodnar', ' @sumerfish', ' @xfilesbutemoji' ]
{% endhighlight %}

Unfortunately, for global searches, the object returned by String.prototype.match is a bit different.  It ignores our capture/non-capture directions and only returns an array containing the matched substrings.  The [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) provide us with some advice for this situation, sending us to learn about RegExp methods that can help us accomplish the task.  Since theoretically we want to execute this operation in tandem with other string methods let's extend the String object with a new method, String.prototype.capture that does what we want:

{% highlight javascript %}
String.prototype.capture = function(regex){
    var string = this.toString();
    var matches = [];
    var current;
        
        while((current = regex.exec(string)) !== null){
            matches.push(current[1]);  // regex.exec(string) returns an array just like String.prototype.match, so our captured group is still at index 1
        }

    return matches;
};
{% endhighlight %}

Our new method uses regex.exec (as suggested in the docs) to match our regex, push the captured group into an array, and continue searching the remainder of the original string via the lastIndex property of the object returned by regex.exec.  Once we reach the end of the string we return the array of captured substrings:

{% highlight javascript %}
var string = "@gnirtsmodnar @sumerfish @xfilesbutemoji, have you been getting weird messages from spooky@email.biz?";

var regex = /(?:^|\s)(@\w{1,15})\b/g;

console.log(string.capture(regex));
{% endhighlight %}

{% highlight console %}
[ '@gnirstmodnar', '@sumerfish', '@xfilesbutemoji' ]
{% endhighlight %}

And that's it.  There's no need to manipulate the results of String.prototype.match before moving on with our operation, just use our new bespoke String method.
