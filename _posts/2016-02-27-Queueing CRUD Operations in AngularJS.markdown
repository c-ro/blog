---
title: Queuing CRUD operations in AngularJS
layout: post
date: 2016-02-27 20:43:16
categories: patterns JavaScript angular ngDialog
---

While working on my grocery-listing app, [PickUp](https://github.com/c-ro/PickUp) I realized the basic CRUD functions were slow enough to make the interactions feel somewhat unresponsive despite functioning without issue.  One such case was a dialog allowing the user to select (and deselect) multiple items from a master list ("What are the items I have or might one day pick up?") to be added to a sub-list ("Which items shall I pick up tomorrow?"). Every time a user clicked the [add] button an HTTP POST request was made that copied the corresponding item into the sub-list.  When multiple request were made in quick succession things seemed to slow down.

To solve this perceived sluggishness I created a queueing system which stores a collection of items to be copied from the master list to the desired sub-list upon closing a dialog.  (For this particular project I am using [ngDialog](https://github.com/likeastore/ngDialog))

___
Let's take a quick look at the old way of adding an item to the sub-list:
{% highlight  javascript %}
$scope.addToList = function(item){
  list.addItemToList(item, function(res){
    console.log(res.data);
  });
};
{% endhighlight %}

Nothing special here. When the user clicks the add button for an item this function is called, the item is passed as an argument and the function tells the list service to send the item to the server.

For our queueing system things will be slightly more complicated. First, we create an empty array which will be used to store requests until we choose to execute them.

{% highlight  javascript %}
$scope.queue = [];
{% endhighlight %}

Then we will will refactor the $scope.addToList function so that instead of making an http request we will push the item into $scope.queue after checking to make sure it is not already present.  If it is, we will remove it from the array.

{% highlight  javascript %}
$scope.addToList = function(item){
  $scope.index = $scope.queue.indexOf(item);

  if($scope.index > -1){
    $scope.queue.splice($scope.index);
  } else {
    $scope.queue.push(item);
  }
};
{% endhighlight %}

Next, we'll create our simple queueing function.  It takes two parameters: an http function and an array.  Notice that we are not hard-coding the $scope.queue array into the function, allowing us to process any queues we might happen to make in the future:

{% highlight javascript %}
$scope.processQueue = function(httpFunc, array){
  array.forEach(function(item){
    httpFunc(item);
  });
};
{% endhighlight %}

Quite simple really.  We use [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) to iterate over the array. On each iteration we call the function we passed in via httpFunc giving it the current object in the array as an argument.

Just once more step.  Since this project uses ngDialog we will take advantage of ngDialog's preCloseCallback to instruct the app to execute our queue as soon as the dialog is closed.  Once that's done we clear the queue so it's ready later use:

{% highlight javascript %}
$scope.addToListDialog = function(currentList){
  ngDialog.open({
    template: 'views/add-to-list-dialog.html',
    scope: $scope,
    preCloseCallback: function(){
      $scope.processQueue($scope.addItemToList, $scope.queue);
      $scope.queue = [];
    }
  });
};
{% endhighlight %}

That's it!  Now our hypothetical user can go absolutely bonkers adding and removing items to their list and the app doesn't make a single request until the last moment.