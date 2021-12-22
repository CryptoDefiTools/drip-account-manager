import Header from '../components/layouts/Header';
import PageContainer from '../components/layouts/PageContainer';

function About() {
    return (
        <PageContainer>
            <Header title="DRIP Accounts Manager" />
            <div className="container px-0 xl:px-28 pt-28">
                This application will help you manage your drip accounts.
            </div>
        </PageContainer>
    );
}

export default About;
