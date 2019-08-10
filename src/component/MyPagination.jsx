import React from "react";
import {Pagination} from "react-bootstrap"
import "../css/MyPagination.css";
var active;
class MyPagination extends React.Component{
    constructor(props){
        super(props)
    }

    setPagination(){
        active = this.props.currentPage;
        let items = [];
        let totalPages=this.props.totalPages;
        let paginationBasic;
        if(active>=5&&active<=(totalPages-4)){
            paginationBasic=(
                <Pagination>
                    <li className="page-li">Update date:&nbsp;{this.props.updateTime}</li>
                    <Pagination.First onClick={()=>this.pageClick(1)}/>
                    <Pagination.Prev onClick={()=>this.pageClick(active-1)}/>
                    <Pagination.Item onClick={()=>this.pageClick(1)}>{1}</Pagination.Item>
                    <Pagination.Ellipsis />
    
                    <Pagination.Item onClick={()=>this.pageClick(active-2)}>{active-2}</Pagination.Item>
                    <Pagination.Item onClick={()=>this.pageClick(active-1)}>{active-1}</Pagination.Item>
                    <Pagination.Item active>{active}</Pagination.Item>
                    <Pagination.Item onClick={()=>this.pageClick(active+1)}>{active+1}</Pagination.Item>
                    <Pagination.Item onClick={()=>this.pageClick(active+2)}>{active+2}</Pagination.Item>
    
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={()=>this.pageClick(totalPages)}>{totalPages}</Pagination.Item>
                    <Pagination.Next onClick={()=>this.pageClick(active+1)}/>
                    <Pagination.Last onClick={()=>this.pageClick(totalPages)}/>
                    <li className="page-li">{this.props.totalElements}&nbsp;items in total</li>
                </Pagination>);
        }else if(active<5&&active<=(totalPages-4)){
            for (let number = 1; number <= active; number++) {
                if(number!==active){
                    items.push(
                        <Pagination.Item key={number} onClick={()=>this.pageClick(number)}>
                        {number}
                        </Pagination.Item>,
                    );
                }else{
                    items.push(
                        <Pagination.Item key={number} active={number === active} >
                        {number}
                        </Pagination.Item>,
                    );
                }
            }
            paginationBasic=(
                <Pagination>
                    <li className="page-li">Update date:&nbsp;{this.props.updateTime}</li>
                    <Pagination.First onClick={()=>this.pageClick(1)}/>
                    <Pagination.Prev onClick={()=>this.pageClick(active-1)}/>
                    {items}
                    <Pagination.Item onClick={()=>this.pageClick(active+1)}>{active+1}</Pagination.Item>
                    <Pagination.Item onClick={()=>this.pageClick(active+2)}>{active+2}</Pagination.Item>
    
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={()=>this.pageClick(totalPages)}>{totalPages}</Pagination.Item>
                    <Pagination.Next onClick={()=>this.pageClick(active+1)}/>
                    <Pagination.Last onClick={()=>this.pageClick(totalPages)}/>
                    <li className="page-li">{this.props.totalElements}&nbsp;items in total</li>
                </Pagination>);
        }else if(active<5&&active>(totalPages-4)){
            for (let number = 1; number <= totalPages; number++) {
                if(number!==active){
                    items.push(
                        <Pagination.Item key={number} onClick={()=>this.pageClick(number)}>
                        {number}
                        </Pagination.Item>,
                    );
                }else{
                    items.push(
                        <Pagination.Item key={number} active={number === active} >
                        {number}
                        </Pagination.Item>,
                    );
                }
            }
            paginationBasic=(
                <Pagination>
                    <li className="page-li">Update date:&nbsp;{this.props.updateTime}</li>
                    <Pagination.First onClick={()=>this.pageClick(1)}/>
                    <Pagination.Prev onClick={()=>this.pageClick(active-1)}/>
                    {items}
                    <Pagination.Next onClick={()=>this.pageClick(active+1)}/>
                    <Pagination.Last onClick={()=>this.pageClick(totalPages)}/>
                    <li className="page-li">{this.props.totalElements}&nbsp;items in total</li>
                </Pagination>);
        }else if(active>=5&&active>(totalPages-4)){
            items.push(
                <Pagination.Item key={active} active={true}>
                    {active}
                </Pagination.Item>,
            );
            for (let number = active+1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item key={number} onClick={()=>this.pageClick(number)}>
                    {number}
                    </Pagination.Item>,
                );
            }
            paginationBasic=(
                <Pagination>
                    <li className="page-li">Update date:&nbsp;{this.props.updateTime}</li>
                    <Pagination.First onClick={()=>this.pageClick(1)}/>
                    <Pagination.Prev onClick={()=>this.pageClick(active-1)}/>
                    <Pagination.Item onClick={()=>this.pageClick(1)}>{1}</Pagination.Item>
                    <Pagination.Ellipsis />
    
                    <Pagination.Item onClick={()=>this.pageClick(active-2)}>{active-2}</Pagination.Item>
                    <Pagination.Item onClick={()=>this.pageClick(active-1)}>{active-1}</Pagination.Item>
                    {items}
                    <Pagination.Next onClick={()=>this.pageClick(active+1)}/>
                    <Pagination.Last onClick={()=>this.pageClick(totalPages)}/>
                    <li className="page-li">{this.props.totalElements}&nbsp;items in total</li>
                </Pagination>);
        }
        return paginationBasic;
    }

    studyGetGameByPage(){
        this.props.fromParentGetGameByPage(active);
    }

    pageClick(page){
        if(page<=this.props.totalPages&&page>0){
            active=page;
            this.studyGetGameByPage();
        }else{

        }
    }

    render(){
        return(
            <div id="my-pagination">
                {this.setPagination()}
            </div>
        );
    }
}

export default MyPagination;