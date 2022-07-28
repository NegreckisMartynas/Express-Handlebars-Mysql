export function render(route, layout, data) {
    //Differents returns if: Async function, function, any
    if(data instanceof Function) {
        if(data.constructor.name === 'AsyncFunction') {
            return renderAsync(route, layout, data);
        }
        else {
            return renderResult(route, layout, data);
        }
    }
    else {
        return renderObject(route, layout, data);
    }
}

export function renderAsync(route, layout, data) {
    return (req, res) => data(req).then( result =>
        renderObject(route, layout, result)(req, res)
    )
}

export function renderResult(route, layout, func) {
    const result = func(req);
    return renderObject(route, layout, result);
}

export function renderObject(route, layout, data) {
    return (_, res) => res.render(route, {layout, ...wrapObject(data)});
}

function wrapObject(input) {
    if(input instanceof Object) return input
    else return {data: input}
}

