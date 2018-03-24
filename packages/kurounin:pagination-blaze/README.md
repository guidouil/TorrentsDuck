Kurounin:Pagination-Blaze
=================

This package provides a bootstrap 3 paginator Blaze template to be used with the [kurounin:pagination](https://atmospherejs.com/kurounin/pagination) package.

# Usage
In the template helpers you need to define a helper to return the pagination instance and you can define an optional callback which should be called right before changing the page
```js
Template.myList.helpers({
    templatePagination: function () {
        return Template.instance().pagination;
    },
    clickEvent: function() {
        return function(e, templateInstance, clickedPage) {
            e.preventDefault();
            console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
        };
    }
});
```

In the template html file add the paginator
```html
{{> defaultBootstrapPaginator pagination=templatePagination limit=10 containerClass="text-center" onClick=clickEvent}}
```

Available template parameters are:
* `pagination`: pagination instance
* `limit`: the maximum number of page links to display
* `containerClass`: optional container class for the paginator
* `paginationClass`: optional class for the *ul* element (defaults to `pagination`)
* `itemClass`: optional class for the page links elements
* `wrapLinks`: if set to true page links will be wrapped in *li* elements (defaults to `true`)
* `onClick`: optional callback to be called when page link is clicked (default callback runs `e.preventDefault()`)