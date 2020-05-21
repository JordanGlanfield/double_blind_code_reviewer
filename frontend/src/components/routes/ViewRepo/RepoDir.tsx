import React, { useState } from "react";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import { List, PageHeader, Typography } from "antd";
import RepoEntry from "./RepoEntry";
import routes from "../../../constants/routes";
import { extractPathFromRoute, getNextDirUp } from "../../../utils/routeUtil";
import { getDir } from "../../../utils/repoApi";
import { useDataSource } from "../../../utils/hooks";
import { getUsername } from "../../../utils/authenticationService";
import ContentArea from "../../styles/ContentArea";
import ClonePrompt from "../ViewRepos/ClonePrompt";
import ReviewForm from "./ReviewForm";
import styled from "styled-components";
import { isReviewComplete, isReviewer } from "../../../utils/reviewApi";
import ReviewFeedbackForm from "./ReviewFeedbackForm";

interface Props extends RouteComponentProps {
}

interface DirEntry {
  name: string,
  isDir: boolean,
  href: string
}

const RepoDir = (props: Props) => {
  let {reviewId, repoId, repoName} = useParams();
  let currentDir = extractPathFromRoute(props);

  const dirSource = useDataSource(() => getDir(repoId ? repoId : "", currentDir));
  const isReviewerSource = useDataSource(() => isReviewer(reviewId));
  const [redirect, setRedirect] = useState(undefined as undefined | string);

  let reviewPresent = reviewId !== undefined;

  if (!repoId || !repoName) {
    return <Redirect to={{
      pathname: routes.HOME,
      state: { from: props.location }
    }}/>
  }

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  let dirContents: DirEntry[];

  if (dirSource.isFetching) {
    dirContents = [];
  } else if (!dirSource.data) {
    return <Typography>Failed to fetch repository data</Typography>;
  } else {
    dirContents = getDirectoryEntries(getUsername(), reviewId, repoId, repoName, currentDir, dirSource.data);
  }

  const shouldSubmitReview = currentDir === "" && !isReviewerSource.isFetching && isReviewerSource.data
    && reviewPresent;

  const shouldSubmitFeedback = !shouldSubmitReview && reviewPresent && !isReviewerSource.isFetching && !isReviewerSource.data;

  return <>
    <PageHeader title={`Currently Viewing: ${repoName}`} onBack={() => setRedirect(routes.getHome(getUsername()))}/>
    <ContentArea>
      <Typography>Current directory: {currentDir === "" ? "/" : ""}{currentDir}</Typography>
      <List
        dataSource={dirContents}
        renderItem={item => <List.Item>
          <RepoEntry name={item.name}
                     isDir={item.isDir}
                     href={item.href}
                     onClick={dirSource.forceRefetch}
                     isReviewing={reviewPresent}
          />
        </List.Item>}
      />
      {shouldSubmitReview && <ReviewDiv><ReviewForm reviewId={reviewId ? reviewId : ""} /></ReviewDiv>}
      {shouldSubmitFeedback && <ReviewDiv><ReviewFeedbackForm reviewId={reviewId ? reviewId : ""}/></ReviewDiv>}
    </ContentArea>
  </>
};

function stringCompare(s1: string, s2: string): number {
  return s1.toLowerCase() < s2.toLowerCase() ? -1 : 1;
}

function getDirectoryEntries(user: string, reviewId: string | undefined, repoId: string, repoName: string,
                             currentDir: string, directory: any): DirEntry[] {
  const atTopLevel = currentDir === "";

  const dirEntries = [];

  if (!atTopLevel) {
    dirEntries.push({
      name: "..",
      isDir: true,
      href: routes.getRepoDir(user, reviewId, repoId, repoName, getNextDirUp(currentDir))
    })
  }

  let path = currentDir;

  if (currentDir !== "") {
    path = currentDir + "/";
  }

  for (let dir of directory.directories.sort(stringCompare)) {
    dirEntries.push({
      name: dir,
      isDir: true,
      href: routes.getRepoDir(user, reviewId, repoId, repoName, path + dir)
    })
  }

  for (let file of directory.files.sort(stringCompare)) {
    dirEntries.push({
      name: file,
      isDir: false,
      href: routes.getRepoFile(user, reviewId, repoId, repoName, path + file)
    })
  }
  return dirEntries;
}

const ReviewDiv = styled.div`
  border-top: 1px solid #dbdbdb;
  margin-top: 10px;
  padding-top: 10px;
`;

export default RepoDir;