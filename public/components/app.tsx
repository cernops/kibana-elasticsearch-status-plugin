import React from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RenderIndexTable} from './tables.tsx';
import {
    EuiHorizontalRule,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageHeader,
    EuiTitle,
    EuiText,
    EuiBasicTable,
    EuiLink,
} from '@elastic/eui';
import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
//import {alertify} from '../../node_modules/alertifyjs';
import * as alertify from 'alertifyjs'
import 'alertifyjs/build/css/alertify.css';

interface KibanaElasticsearchStatusPluginAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const KibanaElasticsearchStatusPluginApp = ({
    basename,
    notifications,
    http,
    navigation,
}: KibanaElasticsearchStatusPluginAppDeps) => {
    // Use React hooks to manage state.
    var update = 0;
    const page_sizes = [10, 50, 100, 200, 5000];
    const [indexlist, setIndexlist] = React.useState();
    const [mappings, setMappings] = React.useState(null);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState( page_sizes[0] );
    const [sortField, setSortField] = React.useState("size");
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [disableLink, setDisableLink] = React.useState(false);

    const tableRef = React.useRef();
    var current_index = "none";
    var subset;

    function NumberOfIndices(){
	if (indexlist){
	    return (Object.keys(indexlist).length);
	} else {
	    return (0)
	}
    }

    const pagination = {
	pageIndex: pageIndex,
	pageSize: pageSize,
	totalItemCount: NumberOfIndices(),
	pageSizeOptions: page_sizes,
    };

    const sorting = {
	sort: {
	    field: sortField,
	    direction: sortDirection,
	    enableAllColumns: true,
	},
    };

    const onTableChange = ({ page = {}, sort = {} }) => {
	const { index: pageIndex, size: pageSize } = page;
	const { field: sortField, direction: sortDirection } = sort;
	setSortField(sortField);
	setSortDirection(sortDirection);
	setPageIndex(pageIndex);
	setPageSize(pageSize);
	FilterIndices(pageIndex, pageSize, sortField, sortDirection);
    };

    const ShowMappings = async (index_name) => {
	current_index = index_name;
	const index_mappings = await http.get(`/api/elasticsearch_status/index/${index_name}`);
	const new_mappings = await index_mappings.result;
	setMappings(new_mappings);
	if (mappings) {
	    const pretty = '<PRE>' + JSON.stringify(mappings, null, 2) + '</PRE>';
	    alertify.alert(
		`Index ${index_name} settings`,
		pretty,
		function(){ alertify.message('OK')})
		.set({'resizable':true});
	} else {
	    alertify.message('Loading ... Please click again.');
	};
    };

    function FilterIndices(pageIndex, pageSize, sortField, sortDirection) {
	// return a subset of indices based on the sorting and page size
	if (indexlist){
	    const tmplist = indexlist;
	    if (sortField && sortDirection) {
		const x = tmplist.sort(function(a, b) {
		    if (a == b) { return 0};
		    if (Number.isNaN(parseFloat(a[sortField])) || Number.isNaN(parseFloat[sortField])){
			if (sortDirection == 'asc'){
			    return (a[sortField] > b[sortField])
			} else {
			    return (a[sortField] < b[sortField]);
			}
		    } else {
			if (sortDirection == 'asc'){
			    return (b[sortField] - a[sortField])
			} else {
			    return (a[sortField] - b[sortField]);
			}
		    }
		});
	    }
	    const number_of_pages = (Object.keys(indexlist).length / pageSize).toInteger;
	    subset = tmplist.slice(pageIndex*pageSize, (1+pageIndex)*pageSize)
	    const subset_length = Object.keys(subset).length;
	    return(subset, subset_length);
	} else {
	    return(null ,0);
	}
    }

    const { pageOfItems, totalItemCount } = FilterIndices(
	pageIndex,
	pageSize,
	sortField,
	sortDirection
    );

    React.useEffect(() => {
	const getindices = async () => {
	    const newlist = await http.get('/api/elasticsearch_status/indices');
	    setIndexlist(await newlist.result);
	    update = update + 1;
	};
	getindices();
    }, [update]);

    return (
          <Router basename={basename}>
            <I18nProvider>
              <>
		<navigation.ui.TopNavMenu appName={PLUGIN_ID} showSearchBar={false} />
		<EuiPage restrictWidth="1000px">
		  <EuiPageBody>
                    <EuiPageHeader>
                      <EuiTitle size="l">
       		<h1>
       		  <FormattedMessage
       		    id="kibanaElasticsearchStatusPlugin.helloWorldText"
       		    defaultMessage="{name}"
       		    values={{ name: PLUGIN_NAME }}
       		    />
       		</h1>
       	      </EuiTitle>
                    </EuiPageHeader>
                    <EuiPageContent>
       	      <EuiPageContentHeader>
       		<EuiTitle>
       		  <h2> <FormattedMessage id="kibanaElasticsearchStatusPlugin.congratulationsTitle" defaultMessage="Currently visible Elasticsearch Indices" /> </h2>
			</EuiTitle>
		      </EuiPageContentHeader>
		      <EuiPageContentBody>
			<EuiText>
       		  <p><FormattedMessage id="kibanaElasticsearchStatusPlugin.content" defaultMessage="Click on the index name to get more information about the index." /> </p>
			  <EuiHorizontalRule />
			  <div>
			    <EuiSwitch
			      label="Disable links"
			      checked={disableLink}
 			      onChange={() => {setDisableLink(!disableLink); setMappings(null);}}
			      />
			  </div>
			  <FormattedMessage
                            id="samplePlugin.timestampText"
                            defaultMessage="Indices: {indices}"
	values={{ indices: subset ? RenderIndexTable(subset, sorting, onTableChange, tableRef, setSelectedItems, selectedItems, disableLink, ShowMappings, pagination) : 'Loading ...' }}
			    />
			  <EuiHorizontalRule />
			  <FormattedMessage
			    id="samplePlugin.mappingText"
			    defaultMessage={(current_index == 'none') ? 'Select an index to show the mappings.' : mappings}
			    />
			</EuiText>
		      </EuiPageContentBody>
                    </EuiPageContent>
                  </EuiPageBody>
		</EuiPage>
              </>
            </I18nProvider>
	  </Router>
    );
};
