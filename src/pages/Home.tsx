import { Columns } from "../components";
import { LoginForm } from "../containers/LoginForm";
import { RegisterForm } from "../containers/RegisterForm";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { CreatePartyForm } from "../containers/CreatePartyForm";
import { PartiesList } from "../containers/PartiesList";
import { LandingLayout } from "../layouts/landing";
import { PartyInterface } from "../types/party";
import { FISH_PARTY } from "../__data__/fish-party";
import { SALAD_PARTY } from "../__data__/salad-party";
import { MEAT_PARTY } from "../__data__/meat-party";
import { COCKTAIL_PARTY } from "../__data__/cocktail-party";
import { HARD_PARTY } from "../__data__/hard-party";
import { Card } from "../components/Card";
import { getBaseTotal } from "../utils/calculation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PartyTotals } from "../containers/PartyTotals";
import { PartyFormLayout } from "../components/PartyFormLayout";

type PartiesShowcase =
  | "shared"
  | "parts"
  | "discount"
  | "discount-percentage"
  | "discount-items";

const DATA_MOCKS: Record<PartiesShowcase, PartyInterface> = {
  shared: FISH_PARTY,
  parts: SALAD_PARTY,
  discount: MEAT_PARTY,
  "discount-percentage": COCKTAIL_PARTY,
  "discount-items": HARD_PARTY,
};

export const Home = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user } = useUser();
  const { token } = user || {};
  const [activeCase, setActiveCase] = useState<PartiesShowcase>("shared");

  const party = DATA_MOCKS[activeCase];
  const total = getBaseTotal(party.items);
  const partyLayoutProps = {
    amountOfUsers: party.users.length,
    isDiscountVisible: activeCase === "discount-items",
    isEquallyVisible: true,
  };

  return (
    <LandingLayout
      showcaseFoot={
        <p className="subtitle is-size-5 has-text-grey-lighter has-text-centered mb-5">
          Memento hangover!
        </p>
      }
      showcaseBody={
        <div className="container has-text-centered">
          <p className="title is-size-1">You have fun, We do the math</p>
          <p className="subtitle is-size-3">
            Share items between all or some users, equally or in parts. Apply
            discounts to your bill in percentages, or in absolute values.
          </p>
        </div>
      }
      sections={
        <>
          <section className="py-6 px-2">
            <div className="container">
              <Columns
                containerProps={{ className: "is-align-content-stretch" }}
              >
                <Card
                  key={1}
                  card={{
                    isFullHeight: true,
                  }}
                  image={{ imageUrl: "/get-some-drinks.jpg" }}
                  content={
                    <p>
                      Share party with friends and start adding your drinks and
                      snaks
                    </p>
                  }
                />
                <Card
                  key={2}
                  card={{
                    isFullHeight: true,
                  }}
                  image={{ imageUrl: "/pay-bill.jpg" }}
                  content={
                    <p>
                      Check, please! You already know how much you should pay
                    </p>
                  }
                />
                <Card
                  key={3}
                  card={{
                    isFullHeight: true,
                  }}
                  image={{ imageUrl: "/friends-convince.jpg" }}
                  content={<p>Convince your friends to return your money</p>}
                />
              </Columns>
            </div>
          </section>
          <section className="py-6 px-2 has-background-white">
            <div className="container">
              <p className="title is-size-4 has-text-centered">
                Let's see some cases...
              </p>
              <p className="subtitle is-size-5 has-text-centered mb-6">
                Considering you have some parties with your fishes
              </p>
              <div className="tabs">
                <ul>
                  <li className={activeCase === "shared" ? "is-active" : ""}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => setActiveCase("shared")}>
                      Shared everything
                    </a>
                  </li>
                  <li className={activeCase === "parts" ? "is-active" : ""}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => setActiveCase("parts")}>In parts</a>
                  </li>
                  <li className={activeCase === "discount" ? "is-active" : ""}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => setActiveCase("discount")}>
                      With discount
                    </a>
                  </li>
                  <li
                    className={
                      activeCase === "discount-percentage" ? "is-active" : ""
                    }
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => setActiveCase("discount-percentage")}>
                      With discount in %
                    </a>
                  </li>
                  <li
                    className={
                      activeCase === "discount-items" ? "is-active" : ""
                    }
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => setActiveCase("discount-items")}>
                      With discount for some items
                    </a>
                  </li>
                </ul>
              </div>
              <div className="columns is-flex-wrap-wrap">
                <div key={`${party.id}-bill`} className="column is-one-third">
                  <nav className="panel">
                    <p className="panel-heading">Your bill</p>
                    <a key="head" className="panel-block ">
                      <span className="panel-icon is-size-7">Qty</span>
                      <span className="is-size-7 has-text-grey ml-1">Name</span>
                      <span className="ml-auto has-text-grey is-size-7">
                        Price
                      </span>
                    </a>
                    {party.items.map((item) => (
                      <a key={item.id} className="panel-block ">
                        <span className="panel-icon">
                          <i>{item.amount}</i>
                        </span>
                        {item.name}
                        <span className="ml-auto">{item.price.toFixed(2)}</span>
                      </a>
                    ))}
                    {party.discount ? (
                      <a
                        key="discount"
                        className="panel-block has-background-white-ter"
                      >
                        <span className="panel-icon"></span>
                        <span className="has-text-grey">Discount</span>

                        <span className="ml-auto">
                          {party.discount}
                          {party.isPercentage && "(%)"}
                        </span>
                      </a>
                    ) : null}
                    <a
                      key="total"
                      className="panel-block has-background-white-ter"
                    >
                      <span className="panel-icon"></span>
                      <span className="has-text-grey">Total</span>

                      <span className="ml-auto">{total.toFixed(2)}</span>
                    </a>
                  </nav>
                </div>
                <div key={party.id} className="column">
                  <p className="title is-size-4">{party.name}</p>
                  <div className="with-scroll-horizontal">
                    <PartyFormLayout {...partyLayoutProps}>
                      <span className="is-size-6 has-text-grey">Item name</span>
                      <span className="is-size-6 has-text-grey">Amount</span>
                      <span className="is-size-6 has-text-grey">Price</span>
                      {partyLayoutProps.isDiscountVisible && (
                        <span className="is-size-6 has-text-grey">
                          Discount
                          <span className="is-size-7 ml-1">(%)</span>
                        </span>
                      )}
                      {partyLayoutProps.isEquallyVisible && (
                        <span className="is-size-6 has-text-grey">
                          Is shared
                        </span>
                      )}
                      {party.users?.length > 0 ? (
                        party.users.map((user) => {
                          const isCurrentUser = user.id === party.owner.id;
                          return (
                            <div key={user.id} className="user-column-title">
                              <span
                                className={`text-overflow-hidden is-size-6${
                                  isCurrentUser ? " has-text-info" : ""
                                }`}
                                title={user.name}
                              >
                                {user.name}
                              </span>
                              {user.id === party.owner.id && (
                                <i>
                                  <FontAwesomeIcon
                                    className={
                                      isCurrentUser ? " has-text-info" : ""
                                    }
                                    icon="crown"
                                    size="2xs"
                                    title="Master of the party"
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
                          {partyLayoutProps.isDiscountVisible && (
                            <span
                              className={`is-size-6${
                                item.discount ? "" : " has-text-grey-light"
                              }`}
                            >
                              {item.discount?.toFixed(2)}
                            </span>
                          )}
                          {partyLayoutProps.isEquallyVisible && (
                            <span className="is-size-6">
                              {item.equally ? "✅" : "❌"}
                            </span>
                          )}
                          {party.users.map(({ id }) => {
                            if (item.equally) {
                              return (
                                <span className="is-size-6">
                                  {!!itemUsers?.find((user) => user.id === id)
                                    ? "✅"
                                    : "❌"}
                                </span>
                              );
                            }
                            const userIndex = itemUsers.findIndex(
                              (user) => user.id === id
                            );

                            return (
                              <div key={id}>
                                <span
                                  className={`is-size-6${
                                    itemUsers[userIndex]?.value
                                      ? ""
                                      : " has-text-grey-light"
                                  }`}
                                >
                                  {itemUsers[userIndex]?.value || 0}
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
          <section className="py-6 px-2">
            <div className="container">
              <p className="title is-size-3 has-text-centered mb-6">
                Now it's time to start your own party
              </p>

              <div className="columns">
                <div className="column">
                  <div className="box">
                    {token ? (
                      <CreatePartyForm />
                    ) : (
                      <>
                        <div className="tabs is-large">
                          <ul>
                            <li
                              className={
                                activeTab === "login" ? "is-active" : ""
                              }
                            >
                              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                              <a onClick={() => setActiveTab("login")}>
                                Log in
                              </a>
                            </li>
                            <li
                              className={
                                activeTab === "register" ? "is-active" : ""
                              }
                            >
                              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                              <a onClick={() => setActiveTab("register")}>
                                Register
                              </a>
                            </li>
                          </ul>
                        </div>
                        {activeTab === "login" && <LoginForm />}
                        {activeTab === "register" && <RegisterForm />}
                      </>
                    )}
                  </div>
                </div>
                <div className="column">
                  {user ? <PartiesList /> : <div className="get-in-touch" />}
                </div>
              </div>
            </div>
          </section>
          <section className="hero is-dark">
            <div className="hero-body">
              <p className="title is-size-5 has-text-centered">
                Don't trust us - verify with your calculator
              </p>
            </div>
          </section>
        </>
      }
    />
  );
};

Home.whyDidYouRender = true;
