(function($) {

  // The tree select control.
  $.fn.treeselect = function(params) {

    // Setup the default parameters for the tree select control.
    params = $.extend({
      colwidth: 18,           /** The width of the columns. */
      selected: null,         /** Callback when an item is selected. */
      load: null              /** Callback to load new tree's */
    }, params);

    /**
     * Constructor.
     */
    var TreeNode = function(nodeparams) {
      $.extend(this, {
        id: 0,                /** The ID of this node. */
        title: '',            /** The title of this node. */
        has_children: false,  /** Boolean if this node has children. */
        children: [],         /** Array of children. */
        level: 0,             /** The level of this node. */
        odd: false,           /** The odd/even state of this row. */
        checked: false,       /** If this node is checked. */
        busy: false,          /** If this node is busy. */
        display: $(),         /** The display of this node. */
        input: $(),           /** The input display. */
        link: $(),            /** The link display. */
        span: $(),            /** The span display. */
        childlist: $()        /** The childlist display. */
      }, nodeparams);
    };

    /**
     * Set the busy cursor for this node.
     */
    TreeNode.prototype.setBusy = function(state) {
      this.busy = state;
      if (state) {
        var busy = $(document.createElement('div')).addClass('treebusy');
        this.display.append(busy);
      }
      else {
        $('div.treebusy', this.display).remove();
      }
    };

    /**
     * Recursively loads and builds all nodes beneath this node.
     */
    TreeNode.prototype.loadAll = function(callback) {

      // If there is a load function.
      if (params.load) {

        // If the children have not been loaded, but this node has children.
        if (this.children.length == 0 && this.has_children) {

          // Load the children.
          params.load(this, function(node) {

            // Build this node then loadAll.
            node.build();
            node.loadAll(callback);
          });
        }
        else {

          // Iterate through each children and load them.  Then call
          // the callback function once all have been loaded.
          var i = this.children.length, count = i, _this = this;
          while (i--) {
            this.children[i].loadAll(function(node) {
              count--;
              if (!count && callback) {
                callback(_this);
              }
            });
          }
        }
      }
    };

    /**
     * Loads a new tree node.
     */
    TreeNode.prototype.loadChildren = function() {

      // Only do this if the load has been defined.
      if (params.load) {

        // Make this node busy.
        this.setBusy(true);

        // Call the load function.
        params.load(this, function(node) {
          node.build();
          node.expand(true);
        });
      }
    };

    /**
     * Expands the node.
     */
    TreeNode.prototype.expand = function(state) {
      this.checked = this.input.is(':checked');
      if (state) {
        this.link.removeClass('collapsed').addClass('expanded');
        this.span.removeClass('collapsed').addClass('expanded');
        this.childlist.show('fast');
      }
      else {
        this.link.removeClass('expanded').addClass('collapsed');
        this.span.removeClass('expanded').addClass('collapsed');
        this.childlist.hide('fast');
      }

      // If the state is expand, but the children have not been loaded.
      if (state && this.children.length == 0 && this.has_children) {

        // If there are no children, then we need to load them.
        this.loadChildren();
      }
    };

    /**
     * Selects a node.
     */
    TreeNode.prototype.select = function(state, flat) {

      // Make sure the flat select is set as a boolean.
      flat = !!flat;

      // Set the checked state.
      this.checked = state;

      // Make sure the input is checked accordingly.
      this.input.attr('checked', state);

      // Trigger an event that this node was selected.
      if (params.selected) {
        params.selected(this, state);
      }

      // Now recursively select the children.
      if (!flat) {
        // Iterate through all my children and select them to, which will cause
        // recursive selections.
        var i = this.children.length;
        while (i--) {
          this.children[i].select(state);
        }
      }
    }

    /**
     * Build the list element.
     */
    TreeNode.prototype.build_list = function() {
      var list = $();
      if (this.id) {
        list = $(document.createElement('li'));
        list.addClass(this.odd ? 'odd' : 'even');
      }
      return list;
    };

    /**
     * Build the input and return.
     */
    TreeNode.prototype.build_input = function(left) {
      if (this.id) {
        this.input = $(document.createElement('input'));
        this.input.attr({
          'type': 'checkbox',
          'value': this.id,
          'name': 'treeselect-' + this.id,
          'checked': this.checked
        });
        this.input.css('left', left + 'px');
        this.input.bind('click', {node: this}, function(event) {

          // Determine if the input is checked.
          var checked = $(event.target).is(':checked');

          // Expand if checked.
          if (checked) {
            event.data.node.expand(true);
          }

          // Call the select method.
          event.data.node.select(checked);
        });
      }
      return this.input;
    };

    /**
     * Creates a node link.
     */
    TreeNode.prototype.build_link = function(element) {
      element.css('cursor', 'pointer').addClass('collapsed');
      element.bind('click', {node: this}, function(event) {
        event.preventDefault();
        event.data.node.expand($(event.target).hasClass('collapsed'));
      });
      return element;
    }

    /**
     * Build the span +/- symbol.
     */
    TreeNode.prototype.build_span = function(left) {
      if (this.id && ((this.children.length > 0) || this.has_children)) {
        this.span = this.build_link($(document.createElement('span')));
        this.span.css('left', left + 'px');
      }
      return this.span;
    };

    /**
     * Build the title link.
     */
    TreeNode.prototype.build_title = function(left) {
      if (this.id && this.title) {
        this.link = this.build_link($(document.createElement('a')));
        this.link.css('marginLeft', left + 'px').text(this.title);
      }
      return this.link;
    };

    /**
     * Build the children.
     */
    TreeNode.prototype.build_children = function() {

      // Create the childlist element.
      this.childlist = $();

      // If this node has children.
      if (this.children.length > 0) {

        // Create the child list.
        this.childlist = $(document.createElement('ul'));

        // Set the odd state.
        var odd = this.odd;

        // Now if there are children, iterate and build them.
        for (var i in this.children) {
          if (this.children.hasOwnProperty(i)) {

            // Alternate the odd state.
            odd = !odd;

            // Create a new TreeNode for this child.
            this.children[i] = new TreeNode($.extend(this.children[i], {
              level: this.level + 1,
              odd: odd,
              checked: this.checked
            }));

            // Now append the built children to this list.
            this.childlist.append(this.children[i].build());
          }
        }
      }

      // Return the childlist.
      return this.childlist;
    };

    /**
     * Builds the DOM and the tree for this node.
     */
    TreeNode.prototype.build = function() {

      // If this is the root node, then load the children.
      if (!this.id && this.children.length == 0) {

        // Load the children.
        this.loadChildren();
      }
      else {
        // Keep track of the left margin for each element.
        var left = 0;

        // Create the list display.
        if (this.display.length == 0) {
          this.display = this.build_list();
        }

        // Now append the input.
        if (this.input.length == 0) {
          this.display.append(this.build_input(left));
        }

        // Now create the +/- sign if needed.
        if (this.span.length == 0) {
          left += params.colwidth;
          this.display.append(this.build_span(left));
        }

        // Now append the node title.
        if (this.link.length == 0) {
          left += params.colwidth;
          this.display.append(this.build_title(left));
        }

        // Append the children.
        if (this.childlist.length == 0) {
          this.display.append(this.build_children());
        }

        // Check if selected.
        if (this.checked) {
          this.select(this.checked);
        }

        // If this node is busy, make it not busy.
        if (this.busy) {
          this.setBusy(false);
        }
      }

      // Return the display.
      return this.display;
    };

    // Iterate through each instance.
    return $(this).each(function() {

      // Create a new tree node.
      new TreeNode($.extend(params, {display: $(this)})).build();

    });
  };
})(jQuery);