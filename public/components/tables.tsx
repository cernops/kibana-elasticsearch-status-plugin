import React from 'react';
import { Trigger } from '../../../../src/plugins/ui_actions/public';
import {
    EuiBasicTable,
    EuiLink,
    EuiIcon,
    EuiToolTip,

} from '@elastic/eui';

function bytesToHuman(size) {
  if (size > 1024*1024*1024)
    return (size/(1024*1024*1024)).toFixed(1) + "gb";
  if(size > 1024*1024)
    return (size/(1024*1024)).toFixed(1) + "mb";
  if(size > 1024)
    return (size/(1024)).toFixed(1) + "kb";

  return size + "b";

}

export function RenderIndexTable(indices, sorting, onTableChange, tableRef, setSelectedItems, selectedItems, disableLink, ShowMappings, pagination){
    // [{"name":".kibana_1","state":"green","replicas":0,"shards":1,"docs":163,"size":47923.2,"sizeText":"46.8kb"}]

    var statistics = {
	indices : indices,
	orderBy : 'name',
	totalIndices : indices.length,
	totalReplicas : 0,
	totalShards : 0,
	totalDocuments : 0,
	totalSize : 0,
    };
    indices.forEach(function(item) {
        statistics.totalReplicas+=item.replicas;
        statistics.totalShards+=item.shards;
        statistics.totalDocuments+=item.docs;
        statistics.totalSize+=item.size;
    });
    statistics.totalSizeText = bytesToHuman(statistics.totalSize);

    // define the tables stuff
    const columns = [
	{
	    field: 'name',
	    name: 'Index',
	    sortable: true,
	    footer: <em>Totals:</em>,
	    enlarge: true,
            fullWidth: true,
	    render: name => (
	            <EuiLink onClick={()=>ShowMappings(name)} disabled={disableLink}>{name} </EuiLink>
	    )
	},
	{
	    field: 'state',
	    name: "State",
	    sortable: true
	},
	{
	    field: 'replicas',
	    name: 'Replicas',
	    sortable: true,
	    footer: <em>{statistics.totalReplicas}</em>,
	    
	},
	{
	    field: 'shards',
	    name: 'Shards',
	    sortable: true,
	    footer: <em>{statistics.totalShards}</em>,
	},
	{
	    field: 'docs',
	    name: 'Docs',
	    sortable: true,
	    footer: <em>{statistics.totalDocuments}</em>,
	},
	{
	    field: 'size',
	    name: 'Size',
	    footer: <em>{statistics.totalSizeText}</em>,
	    sortable: true,
	},
    ];

    const getRowProps = item => {
	const { id } = item;
	return {
	    'data-test-subj': `row-${id}`,
	    className: 'customRowClass',
	    onClick: () => console.log(`Clicked row ${id}`),
	};
    };

    const getCellProps = (item, column) => {
	const { id } = item;
	const { field } = column;
	return {
	    className: 'customCellClass',
	    'data-test-subj': `cell-${id}-${field}`,
	    textOnly: true,
	};
    };
    const items = statistics.indices;
    const onSelectionChange = selectedItems => {
	setSelectedItems([]);
	console.log("selection changed");
	console.log(selectedItems);
	console.log(items);
    };

    const onSelection = () => {
	tableRef.current.setSelection(items);
	console.log("current selection");
	console.log(selectedItems);
    };
    const selectableItems = () => {
	return items;
    }
    const selection = {
	selectable: selectableItems,
	onSelectionChange: onSelectionChange,
	initialSelected: items,
    };
    return(<EuiBasicTable
	   ref={tableRef}
	   items={items}
           itemId="id"
	   columns={columns}
	   sorting={sorting}
	   onChange={onTableChange}
	   pagination={pagination}
//	   isSelectable={true}
//	   selection={selection}
           rowHeader="Index"
	   />
	  );
};
