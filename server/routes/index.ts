import { IRouter } from '../../../../src/core/server';

function parseIndices(response){
    var my_indices = [];
    Object.keys(response).forEach(function(entry){
        var sizeInt=0;
        if (response[entry]["store.size"] ) {
            if (response[entry]["store.size"].endsWith('kb') )
                sizeInt=1024 * Number(response[entry]["store.size"].slice(0,-2));
            else if  (response[entry]["store.size"].endsWith('mb') )
                sizeInt=1024 * 1024 * Number(response[entry]["store.size"].slice(0,-2));
            else if  (response[entry]["store.size"].endsWith('gb'))
                sizeInt=1024 * 1024 * 1024 * Number(response[entry]["store.size"].slice(0,-2));
            else if  (response[entry]["store.size"].endsWith('tb'))
                sizeInt=1024 * 1024 * 1024 * 1024 *Number(response[entry]["store.size"].slice(0,-2));
            else  {
                sizeInt = Number(response[entry]["store.size"].slice(0,-1));
            }
        }

        my_indices.push({"name":response[entry].index, "state":response[entry].health,
                         "replicas":Number(response[entry].rep),
                         "shards":Number(response[entry].pri),
                         "docs":Number(response[entry]["docs.count"]),
                         "size":sizeInt,
                         "sizeText":response[entry]["store.size"]})
    });
    return my_indices;
}

function filter_headers(request) {
    // TODO: it would be nice if we could get them from the kibana configuration file
    const whitelist = [
        "x-forwarded-for",
        "x-forwarded-user",
        "x-proxy-user",
        "x-forwarded-host",
        "x-forwarded-server",
        "authorized",
        "cookie",
        "oidc_access_token",
        "oidc_claim_sub"
    ];
    var headers = {};
    for (var header in request.headers) {
        if (whitelist.indexOf(header) > -1){
            headers[header] = request.headers[header];
        }
    }
    return headers;
}

export function defineRoutes(router: IRouter) {
    router.get({
      path: '/api/elasticsearch_status/indices',
      validate: false,
    },
    async (context, request, response) => {
        const client = context.core.elasticsearch.dataClient;
        const indices = await client.callAsInternalUser('cat.indices', {
            "headers": filter_headers(request),
            "format":"json"
        });
        const result = parseIndices(indices);
        return response.ok( { body: {result} })
    },),
    router.get({
      path: '/api/elasticsearch_status/index/{name}',
      validate: false,
    },
    async (context, request, response) => {
        const client = context.core.elasticsearch.dataClient;
        const result = await client.callAsInternalUser('cluster.state', {
            "headers": filter_headers(request),
            metric: 'metadata',
            index: request.params.name
        });
        return response.ok( { body: {result} })
    },);
}
// see less build/oss/kibana-7.8.1-SNAPSHOT-linux-x86_64/src/core/MIGRATION_EXAMPLES.md
