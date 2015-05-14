# react-ajax-grid
React Ajax Grid
----------------
![Sample Image](http://i58.tinypic.com/n21f7a.jpg)
React ajax grid is simple grid for react.It can sort,filter your data.Just you need to pass dataUrl and column names.You can  show multidimensional array column name like in example Category.Name . 

Usage:

    var SampleList = React.createClass({
        componentWillMount: function () {
            this.defaultColumns = [["Name"],["Category.Name","Category Name (Alias)"],["Price","Price in USD"],["Update","Update Time"]];
            //You can pass your component to grid.It will generate row for this and pass row data to your component.
            this.externalColumns = [["Settings",EditRows]];
            this.dataUrl = "/GetData/";
        },
        render:function(){
        return (<AjaxGridComponent dataUrl={this.dataUrl} filter={true} controllerName={'GetData'} showExternalColumn={true} externalColumns={this.externalColumns} defaultColumns={this.defaultColumns} />);
        }
    });

