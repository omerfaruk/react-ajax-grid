/** @jsx React.DOM */

var Router = ReactRouter;
var Link = Router.Link;







var FilterBox = React.createClass({
    getInitialState: function(){

        var initial = { "filterText":''};

        return initial;
    },

    handleTextChange:function(event)
    {
        this.setState({'filterText': event.target.value});
    },
    handleKeyPress:function(event)
    {

        var ENTER = 13;
        if( event.charCode == ENTER ) {
            this.props.onClick(this.state.filterText);
        }
    },
    render: function(){return(<div className='filterRow col-xs-5 input-group'>
        <input onChange={this.handleTextChange} placeholder="Search term" type='text' className='form-control floating-label' onKeyPress={this.handleKeyPress} />
        <span className="input-group-btn"><button className='btn btn-primary'  onClick={this.props.onClick.bind(null,this.state.filterText)}><i className='fa fa-search'>&nbsp;&nbsp;</i><span>Search</span>
        </button></span></div>)}

});
var Pagination = React.createClass({

    render: function(){
        var pageList = [];

        for (var i=0; i<this.props.maxPages; i++) {
            pageList.push(<li className={this.props.currentPage  == i  ? 'active' :''}><a href="" onClick={this.props.onClick.bind(null,i)} >{i + 1}</a></li>);
        }

        return(
        <div className="text-center">
            <ul className="pagination">
                <li><a href="" onClick={this.props.onClick.bind(null,0)} >«</a></li>
                {pageList}
                <li><a href="" onClick={this.props.onClick.bind(null,this.props.maxPages > 0 ? this.props.maxPages - 1 : 0 )}>»</a></li>
            </ul>
        </div>);
    }
});
//Sample external column.
var EditRows = React.createClass({
   
    render: function () {
        return (<p><a  rel="tooltip" data-color-class="primary" data-animate="animated fadeIn" data-toggle="tooltip" data-original-title="Edit" data-placement="top" href={'#/'+this.props.controllerName + '/Kayit/'+this.props.rowData.RowNumber}><i className="fa fa-edit icon-md  icon-success animated fadeIn" ></i></a>

            <a href={'#/'+this.props.controllerName + '/Detail/'+this.props.rowData.RowNumber} rel="tooltip"  data-color-class="info" data-animate="animated fadeIn" data-toggle="tooltip" data-original-title="Details" data-placement="top"><i className="fa fa-info icon-md  icon-info animated fadeIn" ></i></a>
            <ModalTrigger modal={<MyModal onConfirm={this.handleDelete} />}>
                <a rel="tooltip" data-color-class="primary" data-animate="animated fadeIn" data-toggle="tooltip" data-original-title="Delete" data-placement="top" data-toggle="modal" href="#deleteModal" ><i className="fa fa-remove icon-md icon-danger animated fadeIn" ></i> </a>
            </ModalTrigger>
        </p>);
    }
});

var HeaderRow = React.createClass({

    render: function () {
        var that = this;
        return(
        <tr>
//Generate normal headers
            {this.props.defaultColumns.map(function (column) {

                return (

                    <th onClick={that.props.onClick.bind(null,column)} >
                        {column.length > 1 ? column[1] : column}

                        {(column == that.props.sortColumn) ? <i className={'fa fa-sort-amount-'+that.props.orderBy}></i> : ''}

                    </th>
                );
            })}
            //Generate header for external rows
            {this.props.externalColumns.map(function (column) {
                // Multi dimension array - 0 is column name
                var externalColumnName = column[0];
                return ( <th>{externalColumnName}</th>
                );
            })}

        </tr>);
    }
});
//Generate rows
var Rows = React.createClass({

    render: function(){
        var that = this;

        return(
            <tbody>
            {
            that.props.results.map(function(rowData){
            return (
                <tr>

                {that.props.defaultColumns.map(function (column) {
                    var colName =column[0] ;
                   return (
                       <td>{colName.indexOf('.') > -1 ? rowData[colName.split(".")[0]][colName.split(".")[1]] :rowData[colName]}</td>

                    );
                })}
                {that.props.externalColumns.map(function (column) {
                    // Multi dimension array - 1 is component name
                    var Tag = column[1];

                    return (<td>
                        <Tag rowData={rowData} />
                    </td>
                    );

                })
                }

            </tr>);})}
            </tbody>
        );
    }
});
var AjaxGridComponent = React.createClass({
    getInitialState: function(){

        var initial = { "results": [],
            "currentPage": 0,
            "maxPages": 0,
            "sortColumn":'',
            "sortAscending":'asc',
            "filter":null,
            "pageSize":20,
            "isLoading":true
        };

        return initial;
    },
    componentDidMount:function(){


    },
    componentWillMount: function(){
        this.sortColumn = '';
        this.orderBy = 'asc';
        this.filterKeywords = null;
        this.index = 0;
        this.pageSize = 20;
        this.maxPages = 1;
        this.getExternalData();
    },
    handlePaging: function (index,e) {
        this.index = index;
        this.getExternalData();
        e.preventDefault()
    },
    handleFilter:function(filter,e)
    {

        this.filterKeywords = filter;
        this.getExternalData();
        if(e){
        e.preventDefault()}
    },
    handleSort: function (childComponent) {
        this.setState({sortColumn:childComponent});
        this.index = 0;
        if(this.sortColumn === childComponent){
           if  (this.orderBy ==='asc')
               this.orderBy = 'desc';
            else
               this.orderBy = 'asc';
        }
        else{
            this.sortColumn = childComponent;
            this.orderBy = 'asc';
        }

        this.getExternalData();


    },
    componentWillUpdate: function(nextProps){

    },
    getExternalData: function(index){
        var that = this;
        that.setState({
            isLoading: true

        });
        index = index||0
        $.ajax({
            type: "POST",
            url: this.props.dataUrl,
            data: {index:this.index,size:this.pageSize,orderColumn:this.sortColumn,orderBy:this.orderBy,filterKeywords:this.filterKeywords},
            success: function (resultData) {
                var pagingData = resultData.Paging;
                that.maxPages= Math.round(pagingData.TotalRecordCount  /pagingData.PageSize  );
                that.setState({
                    results: resultData.Data,
                    isLoading: false
                });
            
            }
        });

    },

    render: function(){
        var that = this;

         var columns =<HeaderRow defaultColumns={this.props.defaultColumns} sortColumn={that.sortColumn} orderBy={that.orderBy} onClick={that.handleSort} externalColumns={this.props.externalColumns} />;
         var rows =<Rows defaultColumns={this.props.defaultColumns} results={that.state.results} externalColumns={this.props.externalColumns} />;
        var pagination = <Pagination maxPages={this.maxPages} currentPage={this.index} onClick={that.handlePaging} />
        return(
        <div  className="table-responsive">
              <div className="row">
                <div className='col-xs-2'>
         
            {that.props.filter ? <FilterBox onClick={that.handleFilter} /> :''}

            <p className={this.state.isLoading ? 'visible bg-info' : 'hidden'}><i className='fa fa-info icon-xs'></i> Loading</p>
            </div>
            <table className="table">
            <thead>
               {columns}
            </thead>
           {rows}
            <tfoot>

                {columns}

            </tfoot>
        </table>
            {pagination}
        </div>

        );
    }
});
