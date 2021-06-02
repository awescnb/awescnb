import './index.scss'
import toast from 'plugins/toast'
import { isOwner } from 'utils/cnblog'
import { poll } from 'utils/helpers'
import { appWz, appQ, appGroup, appIng } from 'constants/links'
import { getThemeOptions } from 'options/extra'
import { avatar } from 'constants/cnblog'
import {
    followersDetailsUrl,
    followingDetailsUrl,
    index,
} from 'constants/links'
import {
    getFollowState,
    getBlogname,
    getBlogAge,
    getFollowers,
    getFollowing,
    follow,
    unfollow,
} from 'utils/cnblog'

function createContainer() {
    return $('<div>').addClass('profile')
}

function createSignature() {
    return $('<div>').addClass('profile-signature')
}

function createBackground() {
    const { headerBackground } = getThemeOptions()
    const signatureWrap = createSignature()
    return $('<div>')
        .addClass('profile-banner')
        .css('backgroundImage', `url(${headerBackground})`)
        .append(signatureWrap)
}

function createMenu() {
    const el = $('<div>').addClass('profile-menu')
    const menuItem = [
        {
            title: '收藏',
            url: appWz,
        },
        {
            title: '闪存',
            url: appIng,
        },
        {
            title: '小组',
            url: appGroup,
        },
        {
            title: '博问',
            url: appQ,
        },
    ]

    menuItem.forEach(item => {
        const menuItem = $('<a>')
            .attr('target', '_blank')
            .attr('href', item.url)
            .text(item.title)

        el.append(menuItem)
    })

    return el
}

function createBlur() {
    const { headerBackground } = getThemeOptions()
    return $('<div>')
        .addClass('profile-blur')
        .css('backgroundImage', `url(${headerBackground})`)
}

function createAvatar() {
    return $('<div>')
        .addClass('profile-avatar')
        .append(`<a href="${index}"><img src="${avatar}" /></a>`)
}

function createMessageElements() {
    return $('<div>')
        .addClass('profile-msg')
        .append(
            $('<p>')
                .append(
                    $('<a>')
                        .addClass('profile-nickname')
                        .attr('href', index),
                )
                .append(
                    $('<button>')
                        .addClass('profile-followstate')
                        .attr('href', index),
                ),
        )
        .append(
            $('<p>')
                .append(
                    $('<span>')
                        .addClass('profile-age')
                        .text('园龄：'),
                )
                .append(
                    $('<span>')
                        .addClass('profile-followers')
                        .append('<a>')
                        .attr('href', followersDetailsUrl)
                        .text('粉丝：'),
                )
                .append(
                    $('<span>')
                        .addClass('profile-following')
                        .append('<a>')
                        .attr('href', followingDetailsUrl)
                        .text('关注：'),
                ),
        )
}

function insertMessage() {
    const followState = getFollowState()
    const userName = getBlogname()
    const age = getBlogAge()
    const followers = getFollowers()
    const following = getFollowing()

    $('.profile-nickname').text(userName)
    $('.profile-age').append(age)
    $('.profile-followers').append(followers)
    $('.profile-following').append(following)
    $('.profile-followstate').text(followState ? '取消关注' : '关注')
}

function followAndUnfollow() {
    $('.profile-msg button').click(function() {
        if (isOwner()) {
            return
        }
        const isUnfollowed = $('.profile-followstate').text() === '关注'
        if (isUnfollowed) {
            toast('关注成功')
            $('.profile-followstate').text('取消关注')
            follow()
        } else {
            toast('取消关注')
            $('.profile-followstate').text('关注')
            unfollow()
        }
    })
}

export default () => {
    const container = createContainer()
    const background = createBackground()
    const menu = createMenu()
    const blur = createBlur()
    const avatar = createAvatar()
    const messageWrap = createMessageElements()

    container
        .append(background)
        .append(menu)
        .append(blur)
        .append(avatar)
        .append(messageWrap)

    $('#mainContent').prepend(container)

    followAndUnfollow()
    poll($('#profile_block>a').length, insertMessage)
}
