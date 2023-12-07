import cx from "classnames";
import { Columns, Footer } from "../components";
import { LoginForm } from "../containers/LoginForm";
import { RegisterForm } from "../containers/RegisterForm";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { CreatePartyForm } from "../containers/CreatePartyForm";
import { PartiesList } from "../containers/PartiesList";
import { LandingLayout } from "../layouts/landing";
import { Card } from "../components/Card";
import { getBaseTotal } from "../utils/calculation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PartyTotals } from "../containers/PartyTotals";
import { PartyFormLayout } from "../components/PartyFormLayout";
import {
  CARDS,
  DATA_MOCKS,
  PartiesShowcase,
  TAB_LABELS,
} from "../__data__/landing";
import { HOW_DOES_IT_WORK } from "../__data__/howItWork";
import { useNavigate } from "react-router";
import "./Home.scss";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user } = useUser();
  const [activeCase, setActiveCase] = useState<PartiesShowcase>("shared");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const party = DATA_MOCKS[activeCase];
  const total = getBaseTotal(party.items);
  const partyLayoutProps = {
    amountOfUsers: Object.keys(party.users).length,
    isDiscountVisible: activeCase === "discount-items",
    isEquallyVisible: true,
  };

  return (
    <LandingLayout
      footer={<Footer>{t("TITLE_FOOTER")}</Footer>}
      showcase={{
        foot: (
          <p className="subtitle is-size-5 has-text-grey-lighter has-text-centered mb-5">
            {t("SHOWCASE_TITLE")}
          </p>
        ),
        body: (
          <div className="container has-text-centered">
            <p className="title is-size-1">{t("SHOWCASE_SLOGAN")}</p>
            <p className="subtitle is-size-3">{t("SHOWCASE_SUBTITLE")}</p>
          </div>
        ),
      }}
      sections={
        <>
          <section className="py-6 px-2">
            <div className="container">
              <Columns
                containerProps={{ className: "is-align-content-stretch" }}
              >
                {CARDS.map((cardProps) => (
                  <Card key={cardProps.image?.imageUrl} {...cardProps} />
                ))}
              </Columns>
            </div>
          </section>
          <section className="py-6 px-2 has-background-white">
            <div className="container">
              <p className="title is-size-4 has-text-centered">
                {t("CARDS_TITLE")}
              </p>
              <p className="subtitle is-size-5 has-text-centered mb-6">
                {t("CARDS_SUBTITLE")}
              </p>
              <div className="tabs">
                <ul>
                  {(Object.keys(TAB_LABELS) as Array<PartiesShowcase>).map(
                    (key) => (
                      <li
                        key={key}
                        className={cx({ "is-active": activeCase === key })}
                      >
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a onClick={() => setActiveCase(key)}>
                          {TAB_LABELS[key]}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="columns is-flex-wrap-wrap">
                <div key={`${party.id}-bill`} className="column is-one-third">
                  <nav className="panel">
                    <p className="panel-heading">{t("TITLE_YOUR_BILL")}</p>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a key="head" className="panel-block ">
                      <span className="panel-icon is-size-7">
                        {t("TITLE_QUANTITY_SHORT")}
                      </span>
                      <span className="is-size-7 has-text-grey ml-1">
                        {t("TITLE_NAME")}
                      </span>
                      <span className="ml-auto has-text-grey is-size-7">
                        {t("PRICE")}
                      </span>
                    </a>
                    {party.items.map((item) => (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a key={item.id} className="panel-block ">
                        <span className="panel-icon">
                          <i>{item.amount}</i>
                        </span>
                        {item.name}
                        <span className="ml-auto">{item.price.toFixed(2)}</span>
                      </a>
                    ))}
                    {party.discount ? (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a
                        key="discount"
                        className="panel-block has-background-white-ter"
                      >
                        <span className="panel-icon"></span>
                        <span className="has-text-grey">{t("DISCOUNT")}</span>

                        <span className="ml-auto">
                          {party.discount}
                          {party.isPercentage && "(%)"}
                        </span>
                      </a>
                    ) : null}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                      key="total"
                      className="panel-block has-background-white-ter"
                    >
                      <span className="panel-icon"></span>
                      <span className="has-text-grey">{t("TOTAL")}</span>

                      <span className="ml-auto">{total.toFixed(2)}</span>
                    </a>
                  </nav>
                </div>
                <div key={party.id} className="column">
                  <p className="title is-size-4">{party.name}</p>
                  <div className="with-scroll-horizontal pt-3">
                    <PartyFormLayout {...partyLayoutProps}>
                      <span className="is-size-6 has-text-grey">
                        {t("ITEM_NAME")}
                      </span>
                      <span className="is-size-6 has-text-grey">
                        {t("AMOUNT")}
                      </span>
                      <span className="is-size-6 has-text-grey">
                        {t("PRICE")}
                      </span>
                      <span
                        className={cx("is-size-6 has-text-grey", {
                          "is-invisible": !partyLayoutProps.isDiscountVisible,
                        })}
                      >
                        {t("DISCOUNT")}
                        <span className="is-size-7 ml-1">(%)</span>
                      </span>
                      <span
                        className={cx("is-size-6 has-text-grey", {
                          "is-invisible": !partyLayoutProps.isEquallyVisible,
                        })}
                      >
                        {t("IS_SHARED")}
                      </span>
                      {party.users ? (
                        Object.values(party.users).map((user) => {
                          const isCurrentUser = user.id === party.owner.id;
                          return (
                            <div key={user.id} className="user-column-title">
                              <span
                                className={cx(
                                  "text-overflow-hidden is-size-6",
                                  { "has-text-info": isCurrentUser }
                                )}
                                title={user.name}
                              >
                                {user.name}
                              </span>
                              {user.id === party.owner.id && (
                                <i>
                                  <FontAwesomeIcon
                                    className={cx({
                                      "has-text-info": isCurrentUser,
                                    })}
                                    icon="crown"
                                    size="2xs"
                                    title={t("PARTY_MASTER")}
                                  />
                                </i>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div />
                      )}
                    </PartyFormLayout>
                    {party.items.map((itemProps) => {
                      const { users: itemUsers, ...item } = itemProps;
                      return (
                        <PartyFormLayout
                          {...partyLayoutProps}
                          className="my-3"
                          key={item.id}
                        >
                          <div className="is-size-6 is-flex ">
                            <span>{item.name}</span>
                          </div>
                          <span className="is-size-6">{item.amount}</span>
                          <span className="is-size-6">
                            {item.price.toFixed(2)}
                          </span>
                          <span
                            className={cx("is-size-6", {
                              "is-invisible":
                                !partyLayoutProps.isDiscountVisible,
                              "has-text-grey-light": !item.discount,
                            })}
                          >
                            {item.discount?.toFixed(2)}
                          </span>
                          <span
                            className={cx("is-size-6", {
                              "is-invisible":
                                !partyLayoutProps.isEquallyVisible,
                            })}
                          >
                            {item.equally ? "✅" : "❌"}
                          </span>
                          {Object.keys(party.users).map((id) => {
                            if (item.equally) {
                              return (
                                <span key={id} className="is-size-6">
                                  {itemUsers?.[id] ? "✅" : "❌"}
                                </span>
                              );
                            }

                            return (
                              <div key={id}>
                                <span
                                  className={cx("is-size-6", {
                                    "has-text-grey-light":
                                      !itemUsers[id]?.value,
                                  })}
                                >
                                  {itemUsers[id]?.value || 0}
                                </span>
                              </div>
                            );
                          })}
                        </PartyFormLayout>
                      );
                    })}
                    <PartyTotals
                      partySettings={{
                        isDiscountVisible: partyLayoutProps.isDiscountVisible,
                        isEquallyVisible: partyLayoutProps.isEquallyVisible,
                        view: "party",
                        total: total,
                        isOnline: false,
                        discount: party.discount,
                        discountPercent: party.isPercentage
                          ? party.discount
                          : Number(
                              (((party.discount || 0) * 100) / +total).toFixed(
                                2
                              )
                            ),
                        isPercentage: party.isPercentage,
                      }}
                      party={party}
                      currentUser={party.owner}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="hero is-light py-6 px-2">
            <div className="container">
              <p className="title is-size-3 has-text-centered mb-6">
                {t("TITLE_HOW_IT_WORK")}
              </p>
              <div className="step-grid">
                {HOW_DOES_IT_WORK.map((item, i) => (
                  <div key={i} className={cx(`step-grid-item-${i + 1}`)}>
                    <p className="subtitle is-size-5 mb-5">
                      <i className="is-size-2 has-text-primary party-step mr-3">
                        {i + 1}
                      </i>
                      {item.title}
                    </p>
                    <Card
                      image={{
                        imageUrl: item.imageUrl,
                        className: "is-5by3",
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="subtitle is-size-5 mt-6 has-text-centered">
                <i className="is-size-2 has-text-primary party-step mr-3">
                  {HOW_DOES_IT_WORK.length + 1}
                </i>
                {t("SUBTITLE_HOW_IT_WORK")}
              </p>
              <div className="total-item">
                <Card
                  image={{
                    imageUrl: "/static/media/total.jpg",
                    className: "is-5by3",
                  }}
                />
              </div>
            </div>
          </section>
          <section className="py-6 px-2">
            <div className="container">
              <p className="title is-size-3 has-text-centered mb-6">
                {t("TITLE_START_YOUR_PARTY")}
              </p>

              <div className="columns">
                <div className="column">
                  <div className="box">
                    {user ? (
                      <CreatePartyForm />
                    ) : (
                      <>
                        <div className="tabs is-large">
                          <ul>
                            <li
                              className={cx({
                                "is-active": activeTab === "login",
                              })}
                            >
                              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                              <a onClick={() => setActiveTab("login")}>
                                {t("BUTTON_LOG_IN")}
                              </a>
                            </li>
                            <li
                              className={cx({
                                "is-active": activeTab === "register",
                              })}
                            >
                              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                              <a onClick={() => setActiveTab("register")}>
                                {t("BUTTON_REGISTER")}
                              </a>
                            </li>
                          </ul>
                        </div>
                        {activeTab === "login" && (
                          <LoginForm onLogin={() => navigate("/dashboard")} />
                        )}
                        {activeTab === "register" && (
                          <RegisterForm
                            onRegister={() => navigate("/dashboard")}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="column">
                  {user ? (
                    <PartiesList />
                  ) : (
                    <div className="get-in-touch box is-hidden-mobile" />
                  )}
                </div>
              </div>
            </div>
          </section>
          <section className="hero is-dark">
            <div className="hero-body">
              <p className="title is-size-5 has-text-centered">
                {t("TITLE_DONT_TRUST_US")}
              </p>
            </div>
          </section>
        </>
      }
    />
  );
};

Home.whyDidYouRender = true;

export default Home;
