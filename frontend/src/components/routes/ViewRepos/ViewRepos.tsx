import * as React from "react"
import { useParams } from "react-router-dom";

import {Button, List} from "antd"
import routes from "../../../constants/routes";
import { useState } from "react";
import { getRepos } from "../../../utils/repoApi";

interface Props {
}

const ViewRepos = (props: Props) => {
    const [repos, setRepos] = useState(undefined as undefined | string[]);

    let { user } = useParams();

    if (!user) {
        return <div></div>;
    }

    if (!repos) {
        getRepos().then(reps => setRepos(reps)).catch(error => setRepos([]));
    }

    let userString: string = user;

    return <div>
        <List
            size="large"
            dataSource={repos}
            renderItem={item => <List.Item>
                <Button type="primary" href={routes.getRepoDir(userString, item, "")}>{item}</Button>
            </List.Item>}
        />
    </div>
};

export default ViewRepos