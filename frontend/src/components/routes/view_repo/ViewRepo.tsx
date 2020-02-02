import React from "react";
import { useParams } from "react-router-dom";

interface Props {
}

const ViewRepo = (props: Props) => {
    let {user, repo} = useParams();

    return <div>
        {user}
        {repo}
    </div>;
};

export default ViewRepo;